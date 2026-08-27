// backend/src/controllers/order.controller.ts

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  sendInquiryAdminNotification,
  sendInquiryCustomerConfirmation,
  sendOrderAdminNotification,
  sendOrderCustomerConfirmation,
} from "../services/email.service";

/*
|--------------------------------------------------------------------------
| GET ALL ORDERS - ADMIN
|--------------------------------------------------------------------------
*/

export const getOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        book: true,
        items: {
          include: {
            book: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    return res.status(500).json({
      error: "Failed to fetch orders",
      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE ORDER - ADMIN
|--------------------------------------------------------------------------
*/

export const getOrderById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Order ID is required",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        book: true,
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    return res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);

    return res.status(500).json({
      error: "Failed to fetch order",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ORDERS BY EMAIL - PUBLIC
|--------------------------------------------------------------------------
*/

export const getOrdersByEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const emailValue = req.query.email;

    const email =
      typeof emailValue === "string"
        ? emailValue
        : Array.isArray(emailValue)
          ? String(emailValue[0] || "")
          : "";

    if (!email.trim()) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        email: email.trim().toLowerCase(),
      },

      include: {
        book: true,

        items: {
          include: {
            book: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error(
      "Error fetching orders by email:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE HARDCOPY ORDER / BOOK INQUIRY - PUBLIC
|--------------------------------------------------------------------------
*/

export const createHardcopyOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customerName,
      email,
      phoneNumber,
      deliveryMethod,
      deliveryAddress,
      deliveryTown,
      deliveryNotes,
      items,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | ORDER TYPE
    |--------------------------------------------------------------------------
    */

    const orderType =
      typeof req.body.orderType === "string"
        ? req.body.orderType.trim().toUpperCase()
        : "DIGITAL";

    /*
    |--------------------------------------------------------------------------
    | BASIC CUSTOMER VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      typeof customerName !== "string" ||
      !customerName.trim()
    ) {
      return res.status(400).json({
        error: "Customer name is required",
      });
    }

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    if (
      typeof phoneNumber !== "string" &&
      phoneNumber !== null &&
      phoneNumber !== undefined
    ) {
      return res.status(400).json({
        error: "Invalid phone number",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | EMAIL NORMALIZATION
    |--------------------------------------------------------------------------
    */

    const normalizedEmail =
      email.trim().toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | HANDLE BOOK INQUIRY
    |--------------------------------------------------------------------------
    */

    if (orderType === "INQUIRY") {
      const inquiryMessage =
        typeof req.body.notes === "string" &&
        req.body.notes.trim()
          ? req.body.notes.trim()
          : typeof deliveryNotes === "string" &&
            deliveryNotes.trim()
            ? deliveryNotes.trim()
            : "";

      if (!inquiryMessage) {
        return res.status(400).json({
          error: "Inquiry message is required",
        });
      }

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          error:
            "A book is required for this inquiry",
        });
      }

      const inquiryBookId =
        typeof items[0]?.bookId === "string"
          ? items[0].bookId.trim()
          : "";

      if (!inquiryBookId) {
        return res.status(400).json({
          error: "Book is required for this inquiry",
        });
      }

      const inquiryBook =
        await prisma.book.findUnique({
          where: {
            id: inquiryBookId,
          },
        });

      if (!inquiryBook) {
        return res.status(404).json({
          error: "Book not found",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | SAVE INQUIRY
      |--------------------------------------------------------------------------
      */

      const inquiry =
        await prisma.order.create({
          data: {
            /*
             * Use Prisma relation instead of bookId.
             */
            book: {
              connect: {
                id: inquiryBook.id,
              },
            },

            bookTitle:
              inquiryBook.title,

            orderType: "INQUIRY",

            customerName:
              customerName.trim(),

            email:
              normalizedEmail,

            phoneNumber:
              typeof phoneNumber === "string" &&
              phoneNumber.trim()
                ? phoneNumber.trim()
                : null,

            deliveryMethod: null,

            deliveryAddress: null,

            deliveryTown: null,

            deliveryNotes:
              inquiryMessage,

            paymentMethod: null,

            baseAmountCents: 0,

            amountCents: 0,

            currency: "KES",

            status: "PENDING",

            paymentStatus: "UNPAID",

            notes:
              inquiryMessage,
          },

          include: {
            book: true,

            items: {
              include: {
                book: true,
              },
            },
          },
        });

      /*
      |--------------------------------------------------------------------------
      | SEND EMAIL NOTIFICATIONS
      |--------------------------------------------------------------------------
      */

      let inquiryAdminEmailSent = false;
      let inquiryCustomerEmailSent = false;

      try {
        console.log(
          "📧 Sending inquiry notification to administrator..."
        );

        await sendInquiryAdminNotification({
          customerName: customerName.trim(),
          email: normalizedEmail,
          phoneNumber:
            typeof phoneNumber === "string" && phoneNumber.trim()
              ? phoneNumber.trim()
              : null,
          bookTitle: inquiryBook.title,
          bookId: inquiryBook.id,
          message: inquiryMessage,
          orderNumber: inquiry.id,
        });

        inquiryAdminEmailSent = true;

        console.log(
          "✅ Inquiry admin notification sent."
        );
      } catch (adminError) {
        console.error(
          "❌ Failed to send inquiry admin notification:",
          adminError
        );
      }

      try {
        console.log(
          `📧 Sending inquiry confirmation to ${normalizedEmail}...`
        );

        await sendInquiryCustomerConfirmation({
          customerName: customerName.trim(),
          email: normalizedEmail,
          bookTitle: inquiryBook.title,
          message: inquiryMessage,
          orderNumber: inquiry.id,
        });

        inquiryCustomerEmailSent = true;

        console.log(
          "✅ Inquiry customer confirmation sent."
        );
      } catch (customerError) {
        console.error(
          "❌ Failed to send inquiry customer confirmation:",
          customerError
        );
      }

      /*
      |--------------------------------------------------------------------------
      | RETURN SUCCESS
      |--------------------------------------------------------------------------
      */

      return res.status(201).json({
        success: true,

        message:
          "Inquiry submitted successfully",

        order: inquiry,

        emailNotifications: {
          admin: inquiryAdminEmailSent,
          customer: inquiryCustomerEmailSent,
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE DELIVERY METHOD
    |--------------------------------------------------------------------------
    */

    if (
      deliveryMethod !== "PICKUP" &&
      deliveryMethod !== "DELIVERY"
    ) {
      return res.status(400).json({
        error:
          "Please select a valid delivery method: PICKUP or DELIVERY",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | DELIVERY-SPECIFIC VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      deliveryMethod === "DELIVERY" &&
      (
        typeof deliveryAddress !== "string" ||
        !deliveryAddress.trim()
      )
    ) {
      return res.status(400).json({
        error:
          "Delivery address is required",
      });
    }

    if (
      deliveryMethod === "DELIVERY" &&
      (
        typeof deliveryTown !== "string" ||
        !deliveryTown.trim()
      )
    ) {
      return res.status(400).json({
        error:
          "Delivery town is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE ORDER ITEMS
    |--------------------------------------------------------------------------
    */

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        error:
          "At least one book must be selected",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE INDIVIDUAL ITEMS
    |--------------------------------------------------------------------------
    */

    for (const item of items) {
      if (
        !item ||
        typeof item.bookId !== "string" ||
        !item.bookId.trim()
      ) {
        return res.status(400).json({
          error: "Invalid book selected",
        });
      }

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          error:
            "Book quantity must be at least 1",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | COMBINE DUPLICATE BOOKS
    |--------------------------------------------------------------------------
    */

    const quantityMap =
      new Map<string, number>();

    for (const item of items) {
      const bookId =
        item.bookId.trim();

      const quantity =
        Number(item.quantity);

      quantityMap.set(
        bookId,
        (quantityMap.get(bookId) || 0) +
          quantity
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FETCH BOOKS
    |--------------------------------------------------------------------------
    */

    const bookIds =
      Array.from(quantityMap.keys());

    const books =
      await prisma.book.findMany({
        where: {
          id: {
            in: bookIds,
          },
        },
      });

    /*
    |--------------------------------------------------------------------------
    | MAKE SURE EVERY BOOK EXISTS
    |--------------------------------------------------------------------------
    */

    if (
      books.length !== bookIds.length
    ) {
      const foundIds =
        new Set(
          books.map(
            (book) => book.id
          )
        );

      const missingBooks =
        bookIds.filter(
          (id) =>
            !foundIds.has(id)
        );

      console.error(
        "Missing books:",
        missingBooks
      );

      return res.status(400).json({
        error:
          "One or more selected books could not be found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CALCULATE ORDER TOTAL
    |--------------------------------------------------------------------------
    */

    let totalCents = 0;

    const orderItems =
      books.map((book) => {
        const quantity =
          quantityMap.get(
            book.id
          ) || 1;

        const unitPriceCents =
          Number(
            book.priceCents || 0
          );

        const itemTotal =
          unitPriceCents *
          quantity;

        totalCents += itemTotal;

        return {
          bookId:
            book.id,

          bookTitle:
            book.title,

          quantity,

          unitPriceCents,

          totalCents:
            itemTotal,
        };
      });

    /*
    |--------------------------------------------------------------------------
    | BACKWARD COMPATIBILITY
    |--------------------------------------------------------------------------
    */

    const firstBook =
      books.length > 0
        ? books[0]
        : null;

    /*
    |--------------------------------------------------------------------------
    | CREATE HARDCOPY ORDER
    |--------------------------------------------------------------------------
    */

    const order =
      await prisma.order.create({
        data: {
          /*
           * Use relation instead of bookId.
           */
          ...(firstBook
            ? {
                book: {
                  connect: {
                    id: firstBook.id,
                  },
                },
              }
            : {}),

          bookTitle:
            books.length === 1
              ? books[0].title
              : `${books.length} books`,

          orderType:
            "HARDCOPY",

          customerName:
            customerName.trim(),

          email:
            normalizedEmail,

          phoneNumber:
            typeof phoneNumber === "string"
              ? phoneNumber.trim()
              : null,

          deliveryMethod,

          deliveryAddress:
            typeof deliveryAddress === "string" &&
            deliveryAddress.trim()
              ? deliveryAddress.trim()
              : null,

          deliveryTown:
            typeof deliveryTown === "string" &&
            deliveryTown.trim()
              ? deliveryTown.trim()
              : null,

          deliveryNotes:
            typeof deliveryNotes === "string" &&
            deliveryNotes.trim()
              ? deliveryNotes.trim()
              : null,

          paymentMethod:
            "PENDING",

          baseAmountCents:
            totalCents,

          amountCents:
            totalCents,

          currency:
            "KES",

          status:
            "PENDING",

          paymentStatus:
            "UNPAID",

          notes:
            typeof deliveryNotes === "string" &&
            deliveryNotes.trim()
              ? deliveryNotes.trim()
              : null,

          /*
           * Create individual order items.
           */
          items: {
            create:
              orderItems,
          },
        },

        include: {
          book: true,

          items: {
            include: {
              book: true,
            },
          },
        },
      });

    /*
    |--------------------------------------------------------------------------
    | SEND EMAIL NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    let orderAdminEmailSent = false;
    let orderCustomerEmailSent = false;

    try {
      console.log(
        "📧 Sending order notification to administrator..."
      );

      await sendOrderAdminNotification({
        customerName: customerName.trim(),
        email: normalizedEmail,
        phoneNumber:
          typeof phoneNumber === "string" ? phoneNumber.trim() : null,
        bookTitle: order.bookTitle,
        amountCents: order.amountCents,
        paymentMethod: order.paymentMethod,
        orderType: order.orderType,
        status: order.status,
        paymentStatus: order.paymentStatus,
        orderId: order.id,
        notes: order.notes,
      });

      orderAdminEmailSent = true;

      console.log("✅ Order admin notification sent.");
    } catch (adminError) {
      console.error(
        "❌ Failed to send order admin notification:",
        adminError
      );
    }

    try {
      console.log(
        `📧 Sending order confirmation to ${normalizedEmail}...`
      );

      await sendOrderCustomerConfirmation({
        customerName: customerName.trim(),
        email: normalizedEmail,
        bookTitle: order.bookTitle,
        amountCents: order.amountCents,
        orderId: order.id,
        status: order.status,
      });

      orderCustomerEmailSent = true;

      console.log("✅ Order customer confirmation sent.");
    } catch (customerError) {
      console.error(
        "❌ Failed to send order customer confirmation:",
        customerError
      );
    }

    /*
    |--------------------------------------------------------------------------
    | RETURN CREATED ORDER
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,

      message:
        "Hardcopy order placed successfully",

      order,

      emailNotifications: {
        admin: orderAdminEmailSent,
        customer: orderCustomerEmailSent,
      },
    });
  } catch (error: any) {
    console.error(
      "Error creating hardcopy order:",
      error
    );

    /*
     * Prisma unique constraint.
     */
    if (error?.code === "P2002") {
      return res.status(409).json({
        error:
          "A record with this information already exists",
      });
    }

    return res.status(500).json({
      error:
        "Failed to create hardcopy order",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE ORDER STATUS - ADMIN
|--------------------------------------------------------------------------
*/

export const updateOrderStatus = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { status } =
      req.body;

    if (!id) {
      return res.status(400).json({
        error:
          "Order ID is required",
      });
    }

    if (
      typeof status !== "string" ||
      !status.trim()
    ) {
      return res.status(400).json({
        error:
          "Order status is required",
      });
    }

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "READY",
      "SHIPPED",
      "COMPLETED",
      "CANCELLED",
    ];

    const normalizedStatus =
      status
        .trim()
        .toUpperCase();

    if (
      !allowedStatuses.includes(
        normalizedStatus
      )
    ) {
      return res.status(400).json({
        error:
          `Invalid order status. Allowed statuses: ${allowedStatuses.join(
            ", "
          )}`,
      });
    }

    const order =
      await prisma.order.update({
        where: {
          id,
        },

        data: {
          status:
            normalizedStatus,
        },

        include: {
          book: true,

          items: {
            include: {
              book: true,
            },
          },
        },
      });

    return res.json(order);
  } catch (error: any) {
    console.error(
      "Error updating order status:",
      error
    );

    if (
      error?.code === "P2025"
    ) {
      return res.status(404).json({
        error:
          "Order not found",
      });
    }

    return res.status(500).json({
      error:
        "Failed to update order status",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PAYMENT STATUS - ADMIN
|--------------------------------------------------------------------------
*/

export const updatePaymentStatus =
  async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    try {
      const { id } =
        req.params;

      const {
        paymentStatus,
        paymentMethod,
        transactionCode,
      } = req.body;

      if (!id) {
        return res.status(400).json({
          error:
            "Order ID is required",
        });
      }

      if (
        typeof paymentStatus !==
          "string" ||
        !paymentStatus.trim()
      ) {
        return res.status(400).json({
          error:
            "Payment status is required",
        });
      }

      const allowedPaymentStatuses = [
        "UNPAID",
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
      ];

      const normalizedPaymentStatus =
        paymentStatus
          .trim()
          .toUpperCase();

      if (
        !allowedPaymentStatuses.includes(
          normalizedPaymentStatus
        )
      ) {
        return res.status(400).json({
          error:
            `Invalid payment status. Allowed payment statuses: ${allowedPaymentStatuses.join(
              ", "
            )}`,
        });
      }

      const updateData: {
        paymentStatus: string;
        paymentMethod?: string;
        transactionCode?: string;
      } = {
        paymentStatus:
          normalizedPaymentStatus,
      };

      if (
        typeof paymentMethod ===
          "string" &&
        paymentMethod.trim()
      ) {
        updateData.paymentMethod =
          paymentMethod
            .trim()
            .toUpperCase();
      }

      if (
        typeof transactionCode ===
          "string" &&
        transactionCode.trim()
      ) {
        updateData.transactionCode =
          transactionCode.trim();
      }

      const order =
        await prisma.order.update({
          where: {
            id,
          },

          data: updateData,

          include: {
            book: true,

            items: {
              include: {
                book: true,
              },
            },
          },
        });

      return res.json(order);
    } catch (error: any) {
      console.error(
        "Error updating payment status:",
        error
      );

      if (
        error?.code === "P2025"
      ) {
        return res.status(404).json({
          error:
            "Order not found",
        });
      }

      if (
        error?.code === "P2002"
      ) {
        return res.status(409).json({
          error:
            "This transaction code has already been used",
        });
      }

      return res.status(500).json({
        error:
          "Failed to update payment status",
      });
    }
  };
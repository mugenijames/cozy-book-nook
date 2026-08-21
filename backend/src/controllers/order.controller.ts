// backend/src/controllers/order.controller.ts

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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
| CREATE HARDCOPY ORDER - PUBLIC
|--------------------------------------------------------------------------
|
| POST /api/orders
|
| Expected body:
|
| {
|   customerName,
|   email,
|   phoneNumber,
|   deliveryMethod: "PICKUP" | "DELIVERY",
|   deliveryAddress,
|   deliveryTown,
|   deliveryNotes,
|   items: [
|     {
|       bookId,
|       quantity
|     }
|   ]
| }
|
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
    | Basic validation
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
      typeof phoneNumber !== "string" ||
      !phoneNumber.trim()
    ) {
      return res.status(400).json({
        error: "Phone number is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate delivery method
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
    | Delivery-specific validation
    |--------------------------------------------------------------------------
    */

    if (
      deliveryMethod === "DELIVERY" &&
      (typeof deliveryAddress !== "string" ||
        !deliveryAddress.trim())
    ) {
      return res.status(400).json({
        error: "Delivery address is required",
      });
    }

    if (
      deliveryMethod === "DELIVERY" &&
      (typeof deliveryTown !== "string" ||
        !deliveryTown.trim())
    ) {
      return res.status(400).json({
        error: "Delivery town is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate order items
    |--------------------------------------------------------------------------
    */

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        error: "At least one book must be selected",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate individual items
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

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          error: "Book quantity must be at least 1",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Combine duplicate books
    |--------------------------------------------------------------------------
    */

    const quantityMap =
      new Map<string, number>();

    for (const item of items) {
      const bookId = item.bookId.trim();
      const quantity = Number(item.quantity);

      quantityMap.set(
        bookId,
        (quantityMap.get(bookId) || 0) + quantity
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Fetch books
    |--------------------------------------------------------------------------
    */

    const bookIds = Array.from(
      quantityMap.keys()
    );

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
    | Make sure every requested book exists
    |--------------------------------------------------------------------------
    */

    if (
      books.length !== bookIds.length
    ) {
      const foundIds = new Set(
        books.map((book) => book.id)
      );

      const missingBooks =
        bookIds.filter(
          (id) => !foundIds.has(id)
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
    | Calculate order total
    |--------------------------------------------------------------------------
    */

    let totalCents = 0;

    const orderItems = books.map(
      (book) => {
        const quantity =
          quantityMap.get(book.id) || 1;

        const unitPriceCents =
          Number(book.priceCents || 0);

        const itemTotal =
          unitPriceCents * quantity;

        totalCents += itemTotal;

        return {
          bookId: book.id,
          bookTitle: book.title,
          quantity,
          unitPriceCents,
          totalCents: itemTotal,
        };
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Backward compatibility
    |--------------------------------------------------------------------------
    */

    const firstBook =
      books.length > 0
        ? books[0]
        : null;

    /*
    |--------------------------------------------------------------------------
    | Create order
    |--------------------------------------------------------------------------
    */

    const order =
      await prisma.order.create({
        data: {
          /*
           * Backward compatibility with
           * existing digital orders.
           */
          bookId:
            firstBook?.id || null,

          bookTitle:
            books.length === 1
              ? books[0].title
              : `${books.length} books`,

          /*
           * Identify as hardcopy order.
           */
          orderType: "HARDCOPY",

          /*
           * Customer information.
           */
          customerName:
            customerName.trim(),

          email:
            email.trim().toLowerCase(),

          phoneNumber:
            phoneNumber.trim(),

          /*
           * Delivery information.
           */
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

          /*
           * Payment has not happened yet.
           */
          paymentMethod: "PENDING",

          amountCents: totalCents,

          /*
           * Initial order state.
           */
          status: "PENDING",

          paymentStatus: "UNPAID",

          /*
           * Compatibility notes.
           */
          notes:
            typeof deliveryNotes === "string" &&
            deliveryNotes.trim()
              ? deliveryNotes.trim()
              : null,

          /*
           * Create individual order items.
           */
          items: {
            create: orderItems,
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
    | Return created order
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      message:
        "Hardcopy order placed successfully",

      order,
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
|
| Allowed statuses:
|
| PENDING
| CONFIRMED
| PROCESSING
| READY
| SHIPPED
| COMPLETED
| CANCELLED
|
|--------------------------------------------------------------------------
*/

export const updateOrderStatus = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Order ID is required",
      });
    }

    if (
      typeof status !== "string" ||
      !status.trim()
    ) {
      return res.status(400).json({
        error: "Order status is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate status
    |--------------------------------------------------------------------------
    */

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
      status.trim().toUpperCase();

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

    /*
    |--------------------------------------------------------------------------
    | Update order
    |--------------------------------------------------------------------------
    */

    const order =
      await prisma.order.update({
        where: {
          id,
        },

        data: {
          status: normalizedStatus,
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
      "Error updating order:",
      error
    );

    /*
     * Order does not exist.
     */
    if (error?.code === "P2025") {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    return res.status(500).json({
      error:
        "Failed to update order",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PAYMENT STATUS - ADMIN
|--------------------------------------------------------------------------
|
| Allowed payment statuses:
|
| UNPAID
| PENDING
| PAID
| FAILED
| REFUNDED
|
|--------------------------------------------------------------------------
*/

export const updatePaymentStatus =
  async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

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
        typeof paymentStatus !== "string" ||
        !paymentStatus.trim()
      ) {
        return res.status(400).json({
          error:
            "Payment status is required",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Validate payment status
      |--------------------------------------------------------------------------
      */

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

      /*
      |--------------------------------------------------------------------------
      | Build update object
      |--------------------------------------------------------------------------
      */

      const updateData: {
        paymentStatus: string;
        paymentMethod?: string;
        transactionCode?: string;
      } = {
        paymentStatus:
          normalizedPaymentStatus,
      };

      if (
        typeof paymentMethod === "string" &&
        paymentMethod.trim()
      ) {
        updateData.paymentMethod =
          paymentMethod
            .trim()
            .toUpperCase();
      }

      if (
        typeof transactionCode === "string" &&
        transactionCode.trim()
      ) {
        updateData.transactionCode =
          transactionCode.trim();
      }

      /*
      |--------------------------------------------------------------------------
      | Update payment
      |--------------------------------------------------------------------------
      */

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

      /*
       * Order not found.
       */
      if (error?.code === "P2025") {
        return res.status(404).json({
          error: "Order not found",
        });
      }

      /*
       * Duplicate transaction code.
       */
      if (error?.code === "P2002") {
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
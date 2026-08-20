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
    console.error(
      "Error fetching orders:",
      error
    );

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
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const idValue = Array.isArray(id)
      ? id[0]
      : id;

    if (!idValue) {
      return res.status(400).json({
        error: "Order ID is required",
      });
    }

    const order =
      await prisma.order.findUnique({
        where: {
          id: idValue,
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
    console.error(
      "Error fetching order:",
      error
    );

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

    const email = Array.isArray(emailValue)
      ? emailValue[0]
      : (emailValue as string);

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const orders =
      await prisma.order.findMany({
        where: {
          email,
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
|   deliveryMethod,
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

    if (!customerName?.trim()) {
      return res.status(400).json({
        error: "Customer name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    if (!phoneNumber?.trim()) {
      return res.status(400).json({
        error: "Phone number is required",
      });
    }

    if (
      !deliveryMethod ||
      !["PICKUP", "DELIVERY"].includes(
        deliveryMethod
      )
    ) {
      return res.status(400).json({
        error:
          "Please select a valid delivery method",
      });
    }

    if (
      deliveryMethod === "DELIVERY" &&
      !deliveryAddress?.trim()
    ) {
      return res.status(400).json({
        error:
          "Delivery address is required",
      });
    }

    if (
      !deliveryMethod ||
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
    | Validate quantities
    |--------------------------------------------------------------------------
    */

    for (const item of items) {
      if (!item.bookId) {
        return res.status(400).json({
          error: "Invalid book selected",
        });
      }

      const quantity = Number(
        item.quantity
      );

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
    | Remove duplicate books
    |--------------------------------------------------------------------------
    |
    | If the frontend accidentally sends the same
    | book twice, combine the quantities.
    |
    */

    const quantityMap =
      new Map<string, number>();

    for (const item of items) {
      const quantity = Number(
        item.quantity
      );

      quantityMap.set(
        item.bookId,
        (quantityMap.get(
          item.bookId
        ) || 0) + quantity
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

    if (
      books.length !== bookIds.length
    ) {
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
          quantityMap.get(
            book.id
          ) || 1;

        /*
         * For hardcopy ordering we use
         * the book's priceCents.
         */

        const unitPriceCents =
          Number(
            book.priceCents || 0
          );

        const itemTotal =
          unitPriceCents *
          quantity;

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
    | Create order
    |--------------------------------------------------------------------------
    */

    const firstBook =
      books.length > 0
        ? books[0]
        : null;

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

          orderType: "HARDCOPY",

          customerName:
            customerName.trim(),

          email:
            email.trim().toLowerCase(),

          phoneNumber:
            phoneNumber.trim(),

          deliveryAddress:
            deliveryAddress?.trim() ||
            null,

          deliveryTown:
            deliveryTown?.trim() ||
            null,

          deliveryNotes:
            deliveryNotes?.trim() ||
            null,

          /*
           * Payment has not happened yet.
           */
          paymentMethod:
            "PENDING",

          amountCents:
            totalCents,

          status:
            "PENDING",

          paymentStatus:
            "UNPAID",

          notes:
            deliveryNotes?.trim() ||
            null,

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
  } catch (error) {
    console.error(
      "Error creating hardcopy order:",
      error
    );

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
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { status } =
      req.body;

    const idValue =
      Array.isArray(id)
        ? id[0]
        : id;

    if (!idValue) {
      return res.status(400).json({
        error:
          "Order ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        error:
          "Order status is required",
      });
    }

    const order =
      await prisma.order.update({
        where: {
          id: idValue,
        },

        data: {
          status,
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
  } catch (error) {
    console.error(
      "Error updating order:",
      error
    );

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
*/

export const updatePaymentStatus =
  async (
    req: Request,
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

      const idValue =
        Array.isArray(id)
          ? id[0]
          : id;

      if (!idValue) {
        return res.status(400).json({
          error:
            "Order ID is required",
        });
      }

      if (!paymentStatus) {
        return res.status(400).json({
          error:
            "Payment status is required",
        });
      }

      const order =
        await prisma.order.update({
          where: {
            id: idValue,
          },

          data: {
            paymentStatus,

            ...(paymentMethod && {
              paymentMethod,
            }),

            ...(transactionCode && {
              transactionCode,
            }),
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
    } catch (error) {
      console.error(
        "Error updating payment status:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to update payment status",
      });
    }
  };
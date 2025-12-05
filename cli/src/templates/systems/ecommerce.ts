// E-Commerce System Template
export function generateEcommerceSchema(): string {
    return `
// ==========================================
// E-COMMERCE MODELS
// ==========================================

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Float
  comparePrice Float?
  sku         String   @unique
  quantity    Int      @default(0)
  images      Json     @default("[]")
  featured    Boolean  @default(false)
  isActive    Boolean  @default(true)

  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])

  cartItems   CartItem[]
  orderItems  OrderItem[]
  reviews     Review[]
  wishlists   Wishlist[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([slug])
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  parentId    String?
  parent      Category? @relation("CategoryChildren", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryChildren")
  products    Product[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Cart {
  id          String     @id @default(cuid())
  userId      String     @unique
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items       CartItem[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model CartItem {
  id          String   @id @default(cuid())
  quantity    Int

  cartId      String
  cart        Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([cartId, productId])
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  status          String      @default("pending") // pending, processing, shipped, delivered, cancelled
  subtotal        Float
  shipping        Float       @default(0)
  tax             Float       @default(0)
  discount        Float       @default(0)
  total           Float
  
  shippingAddress Json
  billingAddress  Json?
  notes           String?

  userId          String
  user            User        @relation(fields: [userId], references: [id])

  items           OrderItem[]
  payment         Payment?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id          String   @id @default(cuid())
  quantity    Int
  price       Float
  total       Float

  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  createdAt   DateTime @default(now())

  @@index([orderId])
}

model Payment {
  id              String   @id @default(cuid())
  amount          Float
  method          String   // card, paypal, gcash, cod
  status          String   @default("pending") // pending, completed, failed, refunded
  transactionId   String?
  metadata        Json?

  orderId         String   @unique
  order           Order    @relation(fields: [orderId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Review {
  id          String   @id @default(cuid())
  rating      Int      // 1-5
  title       String?
  content     String
  isVerified  Boolean  @default(false)

  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([productId, userId])
  @@index([productId])
}

model Wishlist {
  id          String   @id @default(cuid())

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  createdAt   DateTime @default(now())

  @@unique([userId, productId])
}

model Coupon {
  id          String    @id @default(cuid())
  code        String    @unique
  type        String    // percentage, fixed
  value       Float
  minOrder    Float?
  maxUses     Int?
  usedCount   Int       @default(0)
  expiresAt   DateTime?
  isActive    Boolean   @default(true)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
`;
}

// E-Commerce Router
export function generateEcommerceRouter(): string {
    return `
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";

export const shopRouter = createTRPCRouter({
  // ==========================================
  // PRODUCTS (Public)
  // ==========================================
  getProducts: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      featured: z.boolean().optional(),
      sort: z.enum(["newest", "price-asc", "price-desc", "popular"]).default("newest"),
      page: z.number().default(1),
      limit: z.number().default(12),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        isActive: true,
        ...(input.category && { category: { slug: input.category } }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search } },
            { description: { contains: input.search } },
          ],
        }),
        ...(input.minPrice && { price: { gte: input.minPrice } }),
        ...(input.maxPrice && { price: { lte: input.maxPrice } }),
        ...(input.featured && { featured: true }),
      };

      const orderBy = {
        newest: { createdAt: "desc" as const },
        "price-asc": { price: "asc" as const },
        "price-desc": { price: "desc" as const },
        popular: { orderItems: { _count: "desc" as const } },
      }[input.sort];

      const [items, total] = await Promise.all([
        ctx.db.product.findMany({
          where,
          include: { category: true, _count: { select: { reviews: true } } },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy,
        }),
        ctx.db.product.count({ where }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  getProduct: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { slug: input.slug },
        include: {
          category: true,
          reviews: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      where: { parentId: null },
      include: { children: true, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  }),

  // ==========================================
  // CART (Protected)
  // ==========================================
  getCart: protectedProcedure.query(async ({ ctx }) => {
    let cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await ctx.db.cart.create({
        data: { userId: ctx.userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }),

  addToCart: protectedProcedure
    .input(z.object({
      productId: z.string(),
      quantity: z.number().int().positive().default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      let cart = await ctx.db.cart.findUnique({ where: { userId: ctx.userId } });

      if (!cart) {
        cart = await ctx.db.cart.create({ data: { userId: ctx.userId } });
      }

      const existingItem = await ctx.db.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId: input.productId } },
      });

      if (existingItem) {
        return ctx.db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + input.quantity },
          include: { product: true },
        });
      }

      return ctx.db.cartItem.create({
        data: { cartId: cart.id, productId: input.productId, quantity: input.quantity },
        include: { product: true },
      });
    }),

  updateCartItem: protectedProcedure
    .input(z.object({
      itemId: z.string(),
      quantity: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cartItem.update({
        where: { id: input.itemId },
        data: { quantity: input.quantity },
      });
    }),

  removeFromCart: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cartItem.delete({ where: { id: input.itemId } });
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const cart = await ctx.db.cart.findUnique({ where: { userId: ctx.userId } });
    if (cart) {
      await ctx.db.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { success: true };
  }),

  // ==========================================
  // ORDERS (Protected)
  // ==========================================
  createOrder: protectedProcedure
    .input(z.object({
      shippingAddress: z.object({
        name: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
        phone: z.string(),
      }),
      paymentMethod: z.enum(["card", "paypal", "gcash", "cod"]),
      couponCode: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const cart = await ctx.db.cart.findUnique({
        where: { userId: ctx.userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      const subtotal = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const shipping = subtotal >= 1000 ? 0 : 50;
      const tax = subtotal * 0.12;
      let discount = 0;

      // Apply coupon
      if (input.couponCode) {
        const coupon = await ctx.db.coupon.findUnique({
          where: { code: input.couponCode, isActive: true },
        });
        if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
          discount = coupon.type === "percentage" 
            ? subtotal * (coupon.value / 100)
            : coupon.value;
        }
      }

      const total = subtotal + shipping + tax - discount;

      // Generate order number
      const count = await ctx.db.order.count();
      const orderNumber = \`ORD-\${Date.now().toString(36).toUpperCase()}-\${count + 1}\`;

      const order = await ctx.db.order.create({
        data: {
          orderNumber,
          userId: ctx.userId,
          subtotal,
          shipping,
          tax,
          discount,
          total,
          shippingAddress: input.shippingAddress,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              total: item.product.price * item.quantity,
            })),
          },
          payment: {
            create: {
              amount: total,
              method: input.paymentMethod,
              status: input.paymentMethod === "cod" ? "pending" : "completed",
            },
          },
        },
        include: { items: true, payment: true },
      });

      // Clear cart
      await ctx.db.cartItem.deleteMany({ where: { cartId: cart.id } });

      // Update product quantities
      for (const item of cart.items) {
        await ctx.db.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return order;
    }),

  getOrders: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const [items, total] = await Promise.all([
        ctx.db.order.findMany({
          where: { userId: ctx.userId },
          include: { items: { include: { product: true } }, payment: true },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        ctx.db.order.count({ where: { userId: ctx.userId } }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  getOrder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findFirst({
        where: { id: input.id, userId: ctx.userId },
        include: { items: { include: { product: true } }, payment: true },
      });
    }),

  // ==========================================
  // REVIEWS
  // ==========================================
  createReview: protectedProcedure
    .input(z.object({
      productId: z.string(),
      rating: z.number().int().min(1).max(5),
      title: z.string().optional(),
      content: z.string().min(10),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user purchased the product
      const purchased = await ctx.db.orderItem.findFirst({
        where: {
          productId: input.productId,
          order: { userId: ctx.userId, status: "delivered" },
        },
      });

      return ctx.db.review.create({
        data: {
          ...input,
          userId: ctx.userId,
          isVerified: !!purchased,
        },
      });
    }),

  // ==========================================
  // WISHLIST
  // ==========================================
  getWishlist: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.wishlist.findMany({
      where: { userId: ctx.userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  toggleWishlist: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.wishlist.findUnique({
        where: { userId_productId: { userId: ctx.userId, productId: input.productId } },
      });

      if (existing) {
        await ctx.db.wishlist.delete({ where: { id: existing.id } });
        return { added: false };
      }

      await ctx.db.wishlist.create({
        data: { userId: ctx.userId, productId: input.productId },
      });
      return { added: true };
    }),
});
`.trim();
}

// POS System Template - Prisma Schema Extension
export function generatePOSSchema(): string {
    return `
// ==========================================
// POS SYSTEM MODELS
// ==========================================

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  sku         String   @unique
  barcode     String?  @unique
  price       Float
  cost        Float    @default(0)
  quantity    Int      @default(0)
  minStock    Int      @default(10)
  image       String?
  isActive    Boolean  @default(true)

  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])

  saleItems   SaleItem[]
  inventoryLogs InventoryLog[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([sku])
  @@index([barcode])
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  image       String?
  products    Product[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Customer {
  id          String   @id @default(cuid())
  name        String
  email       String?  @unique
  phone       String?
  address     String?
  points      Int      @default(0)

  sales       Sale[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Sale {
  id          String     @id @default(cuid())
  invoiceNo   String     @unique
  subtotal    Float
  tax         Float      @default(0)
  discount    Float      @default(0)
  total       Float
  amountPaid  Float
  change      Float      @default(0)
  status      String     @default("completed") // pending, completed, refunded, cancelled
  paymentMethod String   @default("cash") // cash, card, gcash, maya

  customerId  String?
  customer    Customer?  @relation(fields: [customerId], references: [id])

  userId      String
  user        User       @relation(fields: [userId], references: [id])

  items       SaleItem[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([customerId])
  @@index([userId])
  @@index([invoiceNo])
}

model SaleItem {
  id          String   @id @default(cuid())
  quantity    Int
  price       Float
  discount    Float    @default(0)
  total       Float

  saleId      String
  sale        Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  createdAt   DateTime @default(now())

  @@index([saleId])
  @@index([productId])
}

model InventoryLog {
  id          String   @id @default(cuid())
  type        String   // in, out, adjustment
  quantity    Int
  reason      String?
  reference   String?

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  createdAt   DateTime @default(now())

  @@index([productId])
  @@index([userId])
}
`;
}

// POS Router
export function generatePOSRouter(): string {
    return `
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "../trpc";

export const posRouter = createTRPCRouter({
  // ==========================================
  // PRODUCTS
  // ==========================================
  getProducts: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      categoryId: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        isActive: true,
        ...(input.search && {
          OR: [
            { name: { contains: input.search } },
            { sku: { contains: input.search } },
            { barcode: { contains: input.search } },
          ],
        }),
        ...(input.categoryId && { categoryId: input.categoryId }),
      };

      const [items, total] = await Promise.all([
        ctx.db.product.findMany({
          where,
          include: { category: true },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { name: "asc" },
        }),
        ctx.db.product.count({ where }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  getProductByBarcode: protectedProcedure
    .input(z.object({ barcode: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { barcode: input.barcode },
        include: { category: true },
      });
    }),

  createProduct: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      sku: z.string().min(1),
      barcode: z.string().optional(),
      price: z.number().positive(),
      cost: z.number().min(0).default(0),
      quantity: z.number().int().min(0).default(0),
      minStock: z.number().int().min(0).default(10),
      categoryId: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({ data: input });
    }),

  updateProduct: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      price: z.number().positive().optional(),
      cost: z.number().min(0).optional(),
      quantity: z.number().int().min(0).optional(),
      minStock: z.number().int().min(0).optional(),
      categoryId: z.string().nullable().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.product.update({ where: { id }, data });
    }),

  // ==========================================
  // SALES
  // ==========================================
  createSale: protectedProcedure
    .input(z.object({
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
        discount: z.number().min(0).default(0),
      })),
      customerId: z.string().optional(),
      tax: z.number().min(0).default(0),
      discount: z.number().min(0).default(0),
      amountPaid: z.number().positive(),
      paymentMethod: z.enum(["cash", "card", "gcash", "maya"]).default("cash"),
    }))
    .mutation(async ({ ctx, input }) => {
      const subtotal = input.items.reduce(
        (sum, item) => sum + (item.price * item.quantity - item.discount), 0
      );
      const total = subtotal + input.tax - input.discount;
      const change = input.amountPaid - total;

      // Generate invoice number
      const today = new Date();
      const count = await ctx.db.sale.count({
        where: {
          createdAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          },
        },
      });
      const invoiceNo = \`INV-\${today.toISOString().slice(0, 10).replace(/-/g, "")}-\${String(count + 1).padStart(4, "0")}\`;

      // Create sale and update inventory
      const sale = await ctx.db.sale.create({
        data: {
          invoiceNo,
          subtotal,
          tax: input.tax,
          discount: input.discount,
          total,
          amountPaid: input.amountPaid,
          change: Math.max(0, change),
          paymentMethod: input.paymentMethod,
          customerId: input.customerId,
          userId: ctx.userId,
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount,
              total: item.price * item.quantity - item.discount,
            })),
          },
        },
        include: { items: { include: { product: true } }, customer: true },
      });

      // Update product quantities
      for (const item of input.items) {
        await ctx.db.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return sale;
    }),

  getSales: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.startDate && input.endDate && {
          createdAt: { gte: input.startDate, lte: input.endDate },
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.sale.findMany({
          where,
          include: { customer: true, user: true, items: { include: { product: true } } },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        ctx.db.sale.count({ where }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  getSalesSummary: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      const sales = await ctx.db.sale.findMany({
        where: {
          createdAt: { gte: input.startDate, lte: input.endDate },
          status: "completed",
        },
        select: { total: true, tax: true, discount: true },
      });

      return {
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, s) => sum + s.total, 0),
        totalTax: sales.reduce((sum, s) => sum + s.tax, 0),
        totalDiscount: sales.reduce((sum, s) => sum + s.discount, 0),
      };
    }),

  // ==========================================
  // CATEGORIES
  // ==========================================
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  }),

  createCategory: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.create({ data: input });
    }),

  // ==========================================
  // CUSTOMERS
  // ==========================================
  getCustomers: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.customer.findMany({
        where: input.search ? {
          OR: [
            { name: { contains: input.search } },
            { email: { contains: input.search } },
            { phone: { contains: input.search } },
          ],
        } : undefined,
        include: { _count: { select: { sales: true } } },
        orderBy: { name: "asc" },
      });
    }),

  createCustomer: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.customer.create({ data: input });
    }),

  // ==========================================
  // INVENTORY
  // ==========================================
  getLowStockProducts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      where: {
        isActive: true,
        quantity: { lte: ctx.db.product.fields.minStock },
      },
      include: { category: true },
      orderBy: { quantity: "asc" },
    });
  }),

  adjustInventory: adminProcedure
    .input(z.object({
      productId: z.string(),
      type: z.enum(["in", "out", "adjustment"]),
      quantity: z.number().int(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const adjustment = input.type === "out" ? -Math.abs(input.quantity) : input.quantity;

      await ctx.db.product.update({
        where: { id: input.productId },
        data: { quantity: { increment: adjustment } },
      });

      return ctx.db.inventoryLog.create({
        data: {
          productId: input.productId,
          userId: ctx.userId,
          type: input.type,
          quantity: input.quantity,
          reason: input.reason,
        },
      });
    }),
});
`.trim();
}

// POS Page Component
export function generatePOSPage(): string {
    return `
"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");
  const barcodeRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const { data: products } = api.pos.getProducts.useQuery({ search, limit: 100 });
  const { data: productByBarcode } = api.pos.getProductByBarcode.useQuery(
    { barcode },
    { enabled: barcode.length > 0 }
  );
  const createSale = api.pos.createSale.useMutation({
    onSuccess: (sale) => {
      addToast(\`Sale completed! Invoice: \${sale.invoiceNo}\`, "success");
      setCart([]);
      setIsCheckout(false);
      setAmountPaid("");
    },
    onError: (error) => {
      addToast(error.message, "error");
    },
  });

  // Auto-add product when scanned
  useEffect(() => {
    if (productByBarcode) {
      addToCart(productByBarcode);
      setBarcode("");
      barcodeRef.current?.focus();
    }
  }, [productByBarcode]);

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        discount: 0,
      }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity - item.discount,
    0
  );
  const tax = subtotal * 0.12; // 12% VAT
  const total = subtotal + tax;
  const change = parseFloat(amountPaid) - total;

  const handleCheckout = () => {
    if (cart.length === 0) {
      addToast("Cart is empty", "warning");
      return;
    }
    setIsCheckout(true);
  };

  const handlePayment = (method: "cash" | "card" | "gcash" | "maya") => {
    if (parseFloat(amountPaid) < total) {
      addToast("Insufficient payment amount", "error");
      return;
    }

    createSale.mutate({
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
      })),
      tax,
      amountPaid: parseFloat(amountPaid),
      paymentMethod: method,
    });
  };

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      {/* Products Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4 flex gap-2">
          <Input
            ref={barcodeRef}
            placeholder="Scan barcode..."
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-48"
          />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products?.items.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary-500)] transition-all text-left"
            >
              <div className="font-medium truncate">{product.name}</div>
              <div className="text-sm text-[var(--color-text-muted)]">{product.sku}</div>
              <div className="mt-2 text-lg font-bold text-[var(--color-primary-400)]">
                ₱{product.price.toFixed(2)}
              </div>
              <Badge variant={product.quantity > 10 ? "success" : "warning"} className="mt-1">
                Stock: {product.quantity}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold">Current Sale</h2>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]"
            >
              <div className="font-medium">{item.name}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-[var(--color-surface)] hover:bg-red-500/20"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[var(--color-surface)] hover:bg-green-500/20"
                  >
                    +
                  </button>
                </div>
                <div className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center text-[var(--color-text-muted)] py-8">
              Cart is empty
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[var(--color-border)] space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>VAT (12%)</span>
            <span>₱{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t border-[var(--color-border)]">
            <span>Total</span>
            <span className="text-[var(--color-primary-400)]">₱{total.toFixed(2)}</span>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full h-14 text-lg"
          >
            Checkout
          </Button>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal open={isCheckout} onClose={() => setIsCheckout(false)} title="Complete Payment">
        <div className="space-y-4">
          <div className="text-center text-3xl font-bold text-[var(--color-primary-400)]">
            ₱{total.toFixed(2)}
          </div>
          <Input
            label="Amount Paid"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="0.00"
          />
          {parseFloat(amountPaid) >= total && (
            <div className="text-center text-xl text-green-400">
              Change: ₱{change.toFixed(2)}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handlePayment("cash")}>💵 Cash</Button>
            <Button onClick={() => handlePayment("card")} variant="secondary">💳 Card</Button>
            <Button onClick={() => handlePayment("gcash")} variant="outline">📱 GCash</Button>
            <Button onClick={() => handlePayment("maya")} variant="outline">📱 Maya</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
`.trim();
}

// Branch Management System Template
export function generateBranchManagementSchema(): string {
    return `
// ==========================================
// BRANCH MANAGEMENT SYSTEM MODELS
// ==========================================

model Branch {
  id          String     @id @default(cuid())
  name        String     @unique
  code        String     @unique
  address     String
  phone       String?
  email       String?
  manager     String?
  isActive    Boolean    @default(true)

  employees   Employee[]
  inventory   BranchInventory[]
  transfersFrom Transfer[] @relation("TransferFrom")
  transfersTo   Transfer[] @relation("TransferTo")
  reports     BranchReport[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Employee {
  id          String   @id @default(cuid())
  employeeId  String   @unique
  name        String
  email       String?  @unique
  phone       String?
  position    String
  department  String?
  salary      Float?
  hireDate    DateTime
  status      String   @default("active") // active, on-leave, terminated

  branchId    String
  branch      Branch   @relation(fields: [branchId], references: [id])

  userId      String?  @unique
  user        User?    @relation(fields: [userId], references: [id])

  attendances Attendance[]
  leaves      Leave[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([branchId])
}

model BranchInventory {
  id          String   @id @default(cuid())
  productName String
  sku         String
  quantity    Int      @default(0)
  minStock    Int      @default(10)
  location    String?

  branchId    String
  branch      Branch   @relation(fields: [branchId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([branchId, sku])
}

model Transfer {
  id          String   @id @default(cuid())
  transferNo  String   @unique
  status      String   @default("pending") // pending, in-transit, completed, cancelled
  items       Json     // [{ sku, name, quantity }]
  notes       String?

  fromBranchId String
  fromBranch   Branch @relation("TransferFrom", fields: [fromBranchId], references: [id])

  toBranchId   String
  toBranch     Branch @relation("TransferTo", fields: [toBranchId], references: [id])

  requestedBy  String
  approvedBy   String?
  completedAt  DateTime?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([fromBranchId])
  @@index([toBranchId])
}

model Attendance {
  id          String    @id @default(cuid())
  date        DateTime
  timeIn      DateTime?
  timeOut     DateTime?
  status      String    @default("present") // present, absent, late, half-day
  notes       String?

  employeeId  String
  employee    Employee  @relation(fields: [employeeId], references: [id])

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([employeeId, date])
}

model Leave {
  id          String   @id @default(cuid())
  type        String   // vacation, sick, emergency, maternity, paternity
  startDate   DateTime
  endDate     DateTime
  reason      String
  status      String   @default("pending") // pending, approved, rejected

  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id])

  approvedBy  String?
  approvedAt  DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([employeeId])
}

model BranchReport {
  id          String   @id @default(cuid())
  type        String   // daily, weekly, monthly
  period      String   // e.g., "2024-01-15", "2024-W03", "2024-01"
  data        Json     // { sales, expenses, employees, etc. }

  branchId    String
  branch      Branch   @relation(fields: [branchId], references: [id])

  createdBy   String

  createdAt   DateTime @default(now())

  @@unique([branchId, type, period])
}
`;
}

// Branch Management Router
export function generateBranchManagementRouter(): string {
    return `
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "../trpc";

export const branchRouter = createTRPCRouter({
  // ==========================================
  // BRANCHES
  // ==========================================
  getBranches: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.branch.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { employees: true, inventory: true } },
      },
      orderBy: { name: "asc" },
    });
  }),

  getBranch: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.branch.findUnique({
        where: { id: input.id },
        include: {
          employees: { where: { status: "active" } },
          inventory: { orderBy: { productName: "asc" } },
        },
      });
    }),

  createBranch: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      code: z.string().min(1),
      address: z.string().min(1),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      manager: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.branch.create({ data: input });
    }),

  updateBranch: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      manager: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.branch.update({ where: { id }, data });
    }),

  // ==========================================
  // EMPLOYEES
  // ==========================================
  getEmployees: protectedProcedure
    .input(z.object({
      branchId: z.string().optional(),
      status: z.string().optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.branchId && { branchId: input.branchId }),
        ...(input.status && { status: input.status }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search } },
            { employeeId: { contains: input.search } },
            { email: { contains: input.search } },
          ],
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.employee.findMany({
          where,
          include: { branch: true },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { name: "asc" },
        }),
        ctx.db.employee.count({ where }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  createEmployee: adminProcedure
    .input(z.object({
      employeeId: z.string().min(1),
      name: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      position: z.string().min(1),
      department: z.string().optional(),
      salary: z.number().optional(),
      hireDate: z.date(),
      branchId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.employee.create({ data: input });
    }),

  updateEmployee: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      position: z.string().optional(),
      department: z.string().optional(),
      salary: z.number().optional(),
      branchId: z.string().optional(),
      status: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.employee.update({ where: { id }, data });
    }),

  // ==========================================
  // TRANSFERS
  // ==========================================
  getTransfers: protectedProcedure
    .input(z.object({
      branchId: z.string().optional(),
      status: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.branchId && {
          OR: [{ fromBranchId: input.branchId }, { toBranchId: input.branchId }],
        }),
        ...(input.status && { status: input.status }),
      };

      const [items, total] = await Promise.all([
        ctx.db.transfer.findMany({
          where,
          include: { fromBranch: true, toBranch: true },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        ctx.db.transfer.count({ where }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  createTransfer: protectedProcedure
    .input(z.object({
      fromBranchId: z.string(),
      toBranchId: z.string(),
      items: z.array(z.object({
        sku: z.string(),
        name: z.string(),
        quantity: z.number().int().positive(),
      })),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.db.transfer.count();
      const transferNo = \`TR-\${Date.now().toString(36).toUpperCase()}-\${count + 1}\`;

      return ctx.db.transfer.create({
        data: {
          transferNo,
          fromBranchId: input.fromBranchId,
          toBranchId: input.toBranchId,
          items: input.items,
          notes: input.notes,
          requestedBy: ctx.userId,
        },
      });
    }),

  updateTransferStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["in-transit", "completed", "cancelled"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const transfer = await ctx.db.transfer.findUnique({ where: { id: input.id } });
      if (!transfer) throw new Error("Transfer not found");

      // If completing, update inventory
      if (input.status === "completed") {
        const items = transfer.items as Array<{ sku: string; name: string; quantity: number }>;

        for (const item of items) {
          // Decrease from source
          await ctx.db.branchInventory.update({
            where: { branchId_sku: { branchId: transfer.fromBranchId, sku: item.sku } },
            data: { quantity: { decrement: item.quantity } },
          });

          // Increase at destination
          await ctx.db.branchInventory.upsert({
            where: { branchId_sku: { branchId: transfer.toBranchId, sku: item.sku } },
            update: { quantity: { increment: item.quantity } },
            create: {
              branchId: transfer.toBranchId,
              sku: item.sku,
              productName: item.name,
              quantity: item.quantity,
            },
          });
        }
      }

      return ctx.db.transfer.update({
        where: { id: input.id },
        data: {
          status: input.status,
          approvedBy: ctx.userId,
          completedAt: input.status === "completed" ? new Date() : undefined,
        },
      });
    }),

  // ==========================================
  // ATTENDANCE
  // ==========================================
  recordAttendance: protectedProcedure
    .input(z.object({
      employeeId: z.string(),
      type: z.enum(["in", "out"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existing = await ctx.db.attendance.findUnique({
        where: { employeeId_date: { employeeId: input.employeeId, date: today } },
      });

      if (existing) {
        return ctx.db.attendance.update({
          where: { id: existing.id },
          data: { timeOut: input.type === "out" ? new Date() : undefined },
        });
      }

      return ctx.db.attendance.create({
        data: {
          employeeId: input.employeeId,
          date: today,
          timeIn: new Date(),
          status: "present",
        },
      });
    }),

  getAttendance: protectedProcedure
    .input(z.object({
      branchId: z.string().optional(),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.attendance.findMany({
        where: {
          date: { gte: input.startDate, lte: input.endDate },
          ...(input.branchId && { employee: { branchId: input.branchId } }),
        },
        include: { employee: { include: { branch: true } } },
        orderBy: [{ date: "desc" }, { timeIn: "asc" }],
      });
    }),

  // ==========================================
  // REPORTS
  // ==========================================
  getBranchStats: protectedProcedure
    .input(z.object({ branchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [employees, inventory, pendingTransfers] = await Promise.all([
        ctx.db.employee.count({ where: { branchId: input.branchId, status: "active" } }),
        ctx.db.branchInventory.aggregate({
          where: { branchId: input.branchId },
          _sum: { quantity: true },
          _count: true,
        }),
        ctx.db.transfer.count({
          where: {
            OR: [{ fromBranchId: input.branchId }, { toBranchId: input.branchId }],
            status: "pending",
          },
        }),
      ]);

      return {
        employees,
        products: inventory._count,
        totalStock: inventory._sum.quantity || 0,
        pendingTransfers,
      };
    }),
});
`.trim();
}

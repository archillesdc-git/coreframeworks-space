// BAC (Bids and Awards Committee) System Template
export function generateBACSchema(): string {
    return `
// ==========================================
// BAC SYSTEM MODELS
// ==========================================

model Project {
  id              String   @id @default(cuid())
  projectNo       String   @unique
  title           String
  description     String
  budget          Float
  fundSource      String   // govt, loan, etc.
  procurementMode String   // public bidding, shopping, negotiated
  status          String   @default("draft") // draft, published, ongoing, completed, cancelled
  
  category        String   // goods, services, infrastructure
  department      String
  endUser         String?
  
  publishDate     DateTime?
  bidOpenDate     DateTime?
  bidCloseDate    DateTime?
  awardDate       DateTime?

  documents       Document[]
  bids            Bid[]
  timeline        Timeline[]
  award           Award?

  createdById     String
  createdBy       User     @relation(fields: [createdById], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([status])
  @@index([category])
}

model Bidder {
  id              String   @id @default(cuid())
  companyName     String
  tradeName       String?
  registrationNo  String   @unique
  taxId           String?
  address         String
  contactPerson   String
  email           String
  phone           String
  category        String   // A, B, C (based on financial capacity)
  isBlacklisted   Boolean  @default(false)
  blacklistReason String?

  bids            Bid[]
  awards          Award[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Bid {
  id              String   @id @default(cuid())
  amount          Float
  status          String   @default("submitted") // submitted, qualified, disqualified, evaluated, awarded
  technicalScore  Float?
  financialScore  Float?
  totalScore      Float?
  remarks         String?
  
  documents       Json     @default("[]") // [{ name, url, type }]

  projectId       String
  project         Project  @relation(fields: [projectId], references: [id])

  bidderId        String
  bidder          Bidder   @relation(fields: [bidderId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([projectId, bidderId])
  @@index([projectId])
  @@index([bidderId])
}

model Award {
  id              String   @id @default(cuid())
  noticeNo        String   @unique
  awardAmount     Float
  awardDate       DateTime
  startDate       DateTime?
  endDate         DateTime?
  status          String   @default("pending") // pending, accepted, declined

  projectId       String   @unique
  project         Project  @relation(fields: [projectId], references: [id])

  bidderId        String
  bidder          Bidder   @relation(fields: [bidderId], references: [id])

  contract        Contract?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Contract {
  id              String   @id @default(cuid())
  contractNo      String   @unique
  amount          Float
  startDate       DateTime
  endDate         DateTime
  status          String   @default("active") // active, completed, terminated
  
  deliverables    Json     @default("[]")
  milestones      Json     @default("[]")

  awardId         String   @unique
  award           Award    @relation(fields: [awardId], references: [id])

  payments        Payment[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Payment {
  id              String   @id @default(cuid())
  amount          Float
  description     String
  status          String   @default("pending") // pending, approved, paid
  paymentDate     DateTime?

  contractId      String
  contract        Contract @relation(fields: [contractId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Document {
  id              String   @id @default(cuid())
  name            String
  type            String   // bidding-docs, tor, contract, notice
  url             String
  size            Int?

  projectId       String?
  project         Project? @relation(fields: [projectId], references: [id])

  uploadedById    String
  uploadedBy      User     @relation(fields: [uploadedById], references: [id])

  createdAt       DateTime @default(now())
}

model Timeline {
  id              String   @id @default(cuid())
  event           String
  description     String?
  date            DateTime
  completed       Boolean  @default(false)
  completedAt     DateTime?

  projectId       String
  project         Project  @relation(fields: [projectId], references: [id])

  createdAt       DateTime @default(now())

  @@index([projectId])
}
`;
}

// BAC Router
export function generateBACRouter(): string {
    return `
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "../trpc";

export const bacRouter = createTRPCRouter({
  // ==========================================
  // PROJECTS
  // ==========================================
  getProjects: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      category: z.string().optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.status && { status: input.status }),
        ...(input.category && { category: input.category }),
        ...(input.search && {
          OR: [
            { title: { contains: input.search } },
            { projectNo: { contains: input.search } },
          ],
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.project.findMany({
          where,
          include: {
            _count: { select: { bids: true } },
            award: { include: { bidder: true } },
          },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        ctx.db.project.count({ where }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  getProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          bids: { include: { bidder: true }, orderBy: { totalScore: "desc" } },
          documents: true,
          timeline: { orderBy: { date: "asc" } },
          award: { include: { bidder: true, contract: true } },
          createdBy: { select: { name: true, email: true } },
        },
      });
    }),

  createProject: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string(),
      budget: z.number().positive(),
      fundSource: z.string(),
      procurementMode: z.string(),
      category: z.string(),
      department: z.string(),
      endUser: z.string().optional(),
      bidOpenDate: z.date().optional(),
      bidCloseDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.db.project.count();
      const year = new Date().getFullYear();
      const projectNo = \`BAC-\${year}-\${String(count + 1).padStart(5, "0")}\`;

      return ctx.db.project.create({
        data: {
          ...input,
          projectNo,
          createdById: ctx.userId,
        },
      });
    }),

  updateProject: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      budget: z.number().optional(),
      status: z.string().optional(),
      bidOpenDate: z.date().optional(),
      bidCloseDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.project.update({ where: { id }, data });
    }),

  publishProject: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: { id: input.id },
        data: { status: "published", publishDate: new Date() },
      });
    }),

  // ==========================================
  // BIDDERS
  // ==========================================
  getBidders: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        isBlacklisted: false,
        ...(input.category && { category: input.category }),
        ...(input.search && {
          OR: [
            { companyName: { contains: input.search } },
            { registrationNo: { contains: input.search } },
          ],
        }),
      };

      const [items, total] = await Promise.all([
        ctx.db.bidder.findMany({
          where,
          include: { _count: { select: { bids: true, awards: true } } },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { companyName: "asc" },
        }),
        ctx.db.bidder.count({ where }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  createBidder: adminProcedure
    .input(z.object({
      companyName: z.string().min(1),
      tradeName: z.string().optional(),
      registrationNo: z.string().min(1),
      taxId: z.string().optional(),
      address: z.string().min(1),
      contactPerson: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      category: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bidder.create({ data: input });
    }),

  blacklistBidder: adminProcedure
    .input(z.object({
      id: z.string(),
      reason: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bidder.update({
        where: { id: input.id },
        data: { isBlacklisted: true, blacklistReason: input.reason },
      });
    }),

  // ==========================================
  // BIDS
  // ==========================================
  submitBid: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      bidderId: z.string(),
      amount: z.number().positive(),
      documents: z.array(z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bid.create({
        data: {
          projectId: input.projectId,
          bidderId: input.bidderId,
          amount: input.amount,
          documents: input.documents,
        },
      });
    }),

  evaluateBid: adminProcedure
    .input(z.object({
      id: z.string(),
      technicalScore: z.number().min(0).max(100),
      financialScore: z.number().min(0).max(100),
      status: z.enum(["qualified", "disqualified"]),
      remarks: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const totalScore = (input.technicalScore * 0.3) + (input.financialScore * 0.7);

      return ctx.db.bid.update({
        where: { id: input.id },
        data: {
          technicalScore: input.technicalScore,
          financialScore: input.financialScore,
          totalScore,
          status: input.status,
          remarks: input.remarks,
        },
      });
    }),

  // ==========================================
  // AWARDS
  // ==========================================
  createAward: adminProcedure
    .input(z.object({
      projectId: z.string(),
      bidderId: z.string(),
      awardAmount: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.db.award.count();
      const year = new Date().getFullYear();
      const noticeNo = \`NOA-\${year}-\${String(count + 1).padStart(5, "0")}\`;

      // Update project and bid status
      await ctx.db.project.update({
        where: { id: input.projectId },
        data: { status: "completed", awardDate: new Date() },
      });

      await ctx.db.bid.updateMany({
        where: { projectId: input.projectId, bidderId: input.bidderId },
        data: { status: "awarded" },
      });

      return ctx.db.award.create({
        data: {
          noticeNo,
          projectId: input.projectId,
          bidderId: input.bidderId,
          awardAmount: input.awardAmount,
          awardDate: new Date(),
        },
      });
    }),

  // ==========================================
  // REPORTS
  // ==========================================
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalProjects, publishedProjects, ongoingProjects, completedProjects, totalBidders, totalBids] = await Promise.all([
      ctx.db.project.count(),
      ctx.db.project.count({ where: { status: "published" } }),
      ctx.db.project.count({ where: { status: "ongoing" } }),
      ctx.db.project.count({ where: { status: "completed" } }),
      ctx.db.bidder.count({ where: { isBlacklisted: false } }),
      ctx.db.bid.count(),
    ]);

    const projectsByCategory = await ctx.db.project.groupBy({
      by: ["category"],
      _count: true,
    });

    const totalBudget = await ctx.db.project.aggregate({
      _sum: { budget: true },
    });

    return {
      totalProjects,
      publishedProjects,
      ongoingProjects,
      completedProjects,
      totalBidders,
      totalBids,
      projectsByCategory,
      totalBudget: totalBudget._sum.budget || 0,
    };
  }),
});
`.trim();
}

// Evaluation/Ranking System Template
export function generateEvaluationSchema(): string {
    return `
// ==========================================
// EVALUATION SYSTEM MODELS
// ==========================================

model Subject {
  id          String       @id @default(cuid())
  name        String
  department  String?
  position    String?
  image       String?
  isActive    Boolean      @default(true)

  evaluations Evaluation[]

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([department])
}

model Criteria {
  id          String     @id @default(cuid())
  name        String
  description String?
  weight      Float      @default(1.0)
  category    String     // teaching, research, service, etc.
  order       Int        @default(0)
  isActive    Boolean    @default(true)

  ratings     Rating[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([category])
}

model Period {
  id          String       @id @default(cuid())
  name        String       // e.g., "1st Semester 2024-2025"
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean      @default(false)

  evaluations Evaluation[]

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Evaluation {
  id          String   @id @default(cuid())
  status      String   @default("pending") // pending, completed, reviewed
  overallRating Float?
  comments    String?
  isAnonymous Boolean  @default(true)

  subjectId   String
  subject     Subject  @relation(fields: [subjectId], references: [id])

  periodId    String
  period      Period   @relation(fields: [periodId], references: [id])

  evaluatorId String
  evaluator   User     @relation("EvaluatorEvaluations", fields: [evaluatorId], references: [id])

  ratings     Rating[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([subjectId, periodId, evaluatorId])
  @@index([subjectId])
  @@index([periodId])
  @@index([evaluatorId])
}

model Rating {
  id           String     @id @default(cuid())
  score        Int        // 1-5
  comment      String?

  evaluationId String
  evaluation   Evaluation @relation(fields: [evaluationId], references: [id], onDelete: Cascade)

  criteriaId   String
  criteria     Criteria   @relation(fields: [criteriaId], references: [id])

  createdAt    DateTime   @default(now())

  @@unique([evaluationId, criteriaId])
}

model EvaluationSummary {
  id              String   @id @default(cuid())
  periodId        String
  subjectId       String
  totalResponses  Int
  averageRating   Float
  categoryRatings Json     // { teaching: 4.5, research: 4.2, ... }
  rank            Int?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([periodId, subjectId])
}
`;
}

// Evaluation Router
export function generateEvaluationRouter(): string {
    return `
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";

export const evaluationRouter = createTRPCRouter({
  // ==========================================
  // SUBJECTS
  // ==========================================
  getSubjects: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      department: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        isActive: true,
        ...(input.search && {
          OR: [
            { name: { contains: input.search } },
            { department: { contains: input.search } },
          ],
        }),
        ...(input.department && { department: input.department }),
      };

      const [items, total] = await Promise.all([
        ctx.db.subject.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { name: "asc" },
        }),
        ctx.db.subject.count({ where }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  createSubject: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      department: z.string().optional(),
      position: z.string().optional(),
      image: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subject.create({ data: input });
    }),

  updateSubject: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      department: z.string().optional(),
      position: z.string().optional(),
      image: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.subject.update({ where: { id }, data });
    }),

  // ==========================================
  // CRITERIA
  // ==========================================
  getCriteria: protectedProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.criteria.findMany({
        where: {
          isActive: true,
          ...(input.category && { category: input.category }),
        },
        orderBy: [{ category: "asc" }, { order: "asc" }],
      });
    }),

  createCriteria: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.string(),
      weight: z.number().min(0).max(1).default(1),
      order: z.number().int().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.criteria.create({ data: input });
    }),

  // ==========================================
  // PERIODS
  // ==========================================
  getPeriods: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.period.findMany({
      orderBy: { startDate: "desc" },
      include: { _count: { select: { evaluations: true } } },
    });
  }),

  getActivePeriod: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.period.findFirst({ where: { isActive: true } });
  }),

  createPeriod: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.period.create({ data: input });
    }),

  setActivePeriod: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.period.updateMany({ data: { isActive: false } });
      return ctx.db.period.update({
        where: { id: input.id },
        data: { isActive: true },
      });
    }),

  // ==========================================
  // EVALUATIONS
  // ==========================================
  getMyPendingEvaluations: protectedProcedure.query(async ({ ctx }) => {
    const activePeriod = await ctx.db.period.findFirst({ where: { isActive: true } });
    if (!activePeriod) return [];

    const completed = await ctx.db.evaluation.findMany({
      where: { evaluatorId: ctx.userId, periodId: activePeriod.id },
      select: { subjectId: true },
    });

    const completedIds = completed.map((e) => e.subjectId);

    return ctx.db.subject.findMany({
      where: {
        isActive: true,
        id: { notIn: completedIds },
      },
      orderBy: { name: "asc" },
    });
  }),

  submitEvaluation: protectedProcedure
    .input(z.object({
      subjectId: z.string(),
      periodId: z.string(),
      ratings: z.array(z.object({
        criteriaId: z.string(),
        score: z.number().int().min(1).max(5),
        comment: z.string().optional(),
      })),
      comments: z.string().optional(),
      isAnonymous: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      // Calculate overall rating
      const criteria = await ctx.db.criteria.findMany({
        where: { id: { in: input.ratings.map((r) => r.criteriaId) } },
      });

      let totalWeight = 0;
      let weightedSum = 0;
      for (const rating of input.ratings) {
        const c = criteria.find((cr) => cr.id === rating.criteriaId);
        if (c) {
          weightedSum += rating.score * c.weight;
          totalWeight += c.weight;
        }
      }
      const overallRating = totalWeight > 0 ? weightedSum / totalWeight : 0;

      return ctx.db.evaluation.create({
        data: {
          subjectId: input.subjectId,
          periodId: input.periodId,
          evaluatorId: ctx.userId,
          comments: input.comments,
          isAnonymous: input.isAnonymous,
          overallRating,
          status: "completed",
          ratings: {
            create: input.ratings.map((r) => ({
              criteriaId: r.criteriaId,
              score: r.score,
              comment: r.comment,
            })),
          },
        },
        include: { ratings: true },
      });
    }),

  // ==========================================
  // REPORTS & RANKINGS
  // ==========================================
  getSubjectReport: adminProcedure
    .input(z.object({
      subjectId: z.string(),
      periodId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        subjectId: input.subjectId,
        status: "completed",
        ...(input.periodId && { periodId: input.periodId }),
      };

      const evaluations = await ctx.db.evaluation.findMany({
        where,
        include: {
          ratings: { include: { criteria: true } },
          period: true,
        },
      });

      const totalResponses = evaluations.length;
      const averageRating = totalResponses > 0
        ? evaluations.reduce((sum, e) => sum + (e.overallRating || 0), 0) / totalResponses
        : 0;

      // Group by criteria category
      const categoryRatings: Record<string, { total: number; count: number }> = {};
      for (const evaluation of evaluations) {
        for (const rating of evaluation.ratings) {
          const cat = rating.criteria.category;
          if (!categoryRatings[cat]) {
            categoryRatings[cat] = { total: 0, count: 0 };
          }
          categoryRatings[cat].total += rating.score;
          categoryRatings[cat].count += 1;
        }
      }

      const categoryAverages = Object.fromEntries(
        Object.entries(categoryRatings).map(([cat, data]) => [
          cat,
          data.count > 0 ? data.total / data.count : 0,
        ])
      );

      return {
        totalResponses,
        averageRating,
        categoryAverages,
        evaluations: evaluations.map((e) => ({
          id: e.id,
          overallRating: e.overallRating,
          comments: e.comments,
          period: e.period.name,
          createdAt: e.createdAt,
        })),
      };
    }),

  getRankings: adminProcedure
    .input(z.object({
      periodId: z.string(),
      department: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const subjects = await ctx.db.subject.findMany({
        where: {
          isActive: true,
          ...(input.department && { department: input.department }),
        },
        include: {
          evaluations: {
            where: { periodId: input.periodId, status: "completed" },
          },
        },
      });

      const rankings = subjects
        .map((subject) => {
          const totalResponses = subject.evaluations.length;
          const averageRating = totalResponses > 0
            ? subject.evaluations.reduce((sum, e) => sum + (e.overallRating || 0), 0) / totalResponses
            : 0;

          return {
            id: subject.id,
            name: subject.name,
            department: subject.department,
            position: subject.position,
            totalResponses,
            averageRating,
          };
        })
        .filter((s) => s.totalResponses > 0)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, input.limit)
        .map((s, index) => ({ ...s, rank: index + 1 }));

      return rankings;
    }),

  getDepartmentStats: adminProcedure
    .input(z.object({ periodId: z.string() }))
    .query(async ({ ctx, input }) => {
      const subjects = await ctx.db.subject.findMany({
        where: { isActive: true },
        include: {
          evaluations: {
            where: { periodId: input.periodId, status: "completed" },
          },
        },
      });

      const deptStats: Record<string, { total: number; sum: number; count: number }> = {};

      for (const subject of subjects) {
        const dept = subject.department || "Unknown";
        if (!deptStats[dept]) {
          deptStats[dept] = { total: 0, sum: 0, count: 0 };
        }
        deptStats[dept].total += 1;
        if (subject.evaluations.length > 0) {
          const avg = subject.evaluations.reduce((s, e) => s + (e.overallRating || 0), 0) / subject.evaluations.length;
          deptStats[dept].sum += avg;
          deptStats[dept].count += 1;
        }
      }

      return Object.entries(deptStats).map(([dept, data]) => ({
        department: dept,
        totalSubjects: data.total,
        evaluatedSubjects: data.count,
        averageRating: data.count > 0 ? data.sum / data.count : 0,
      }));
    }),
});
`.trim();
}

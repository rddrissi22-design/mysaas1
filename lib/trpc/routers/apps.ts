import { createTRPCRouter, protectedProcedure } from '../server';
import { z } from 'zod';

export const appsRouter = createTRPCRouter({
  // Vibe app procedures
  getVibePrompts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.vibePrompt.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: 'desc' }
    });
  }),

  createVibePrompt: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vibePrompt.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          response: `Mock response for: "${input.content}"\n\nThis is a demo response. In a real implementation, this would connect to an AI service.`
        }
      });
    }),

  updateVibePrompt: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.vibePrompt.update({
        where: {
          id,
          userId: ctx.session.user.id
        },
        data: updateData
      });
    }),

  deleteVibePrompt: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vibePrompt.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        }
      });
    }),

  getVibePrompt: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.vibePrompt.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        }
      });
    }),
});
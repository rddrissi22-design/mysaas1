import { createTRPCRouter, protectedProcedure } from '../server';
import { z } from 'zod';

export const authRouter = createTRPCRouter({
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        marketingOptIn: z.boolean().optional(),
        theme: z.enum(['light', 'dark', 'system']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),
});
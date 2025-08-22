import { createTRPCRouter, protectedProcedure } from '../server';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const organizationsRouter = createTRPCRouter({
  getUserOrganizations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.membership.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        org: {
          include: {
            subscription: true,
            _count: { select: { memberships: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if slug is already taken
      const existingOrg = await ctx.db.organization.findUnique({
        where: { slug: input.slug }
      });

      if (existingOrg) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Organization slug already exists'
        });
      }

      // Create organization and membership in a transaction
      const org = await ctx.db.$transaction(async (tx) => {
        const newOrg = await tx.organization.create({
          data: {
            ...input,
            createdById: ctx.session.user.id,
          }
        });

        await tx.membership.create({
          data: {
            userId: ctx.session.user.id,
            orgId: newOrg.id,
            role: 'OWNER'
          }
        });

        // Create default subscription
        await tx.subscription.create({
          data: {
            orgId: newOrg.id,
            status: 'TRIALING',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            amount: 2900, // $29
            currency: 'USD',
            billingInterval: 'monthly'
          }
        });

        return newOrg;
      });

      return org;
    }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          org: { slug: input.slug }
        },
        include: {
          org: {
            include: {
              subscription: true,
              memberships: { include: { user: true } }
            }
          }
        }
      });

      if (!membership) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found'
        });
      }

      return membership.org;
    }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has admin access
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          orgId: input.orgId,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      });

      if (!membership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        });
      }

      const { orgId, ...updateData } = input;
      return ctx.db.organization.update({
        where: { id: orgId },
        data: updateData
      });
    }),
});
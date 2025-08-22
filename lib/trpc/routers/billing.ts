import { createTRPCRouter, protectedProcedure, adminProcedure } from '../server';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const billingRouter = createTRPCRouter({
  getSubscription: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify user access
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          orgId: input.orgId
        }
      });

      if (!membership) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return ctx.db.subscription.findUnique({
        where: { orgId: input.orgId },
        include: { invoices: { orderBy: { createdAt: 'desc' } } }
      });
    }),

  getInvoices: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          orgId: input.orgId
        }
      });

      if (!membership) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return ctx.db.invoice.findMany({
        where: { orgId: input.orgId },
        include: { transactions: true },
        orderBy: { createdAt: 'desc' }
      });
    }),

  createTransaction: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        bankReference: z.string().min(1),
        amount: z.number().positive(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get invoice and verify access
      const invoice = await ctx.db.invoice.findUnique({
        where: { id: input.invoiceId },
        include: { org: { include: { memberships: true } } }
      });

      if (!invoice) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found' });
      }

      const hasAccess = invoice.org.memberships.some(m => m.userId === ctx.session.user.id);
      if (!hasAccess) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return ctx.db.transaction.create({
        data: {
          invoiceId: input.invoiceId,
          orgId: invoice.orgId,
          amount: input.amount,
          bankReference: input.bankReference,
          notes: input.notes,
          status: 'PENDING'
        }
      });
    }),

  // Admin procedures
  getPendingTransactions: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.transaction.findMany({
      where: { status: 'PENDING' },
      include: {
        invoice: { include: { org: true } },
        org: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }),

  approveTransaction: adminProcedure
    .input(
      z.object({
        transactionId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        // Update transaction
        const transaction = await tx.transaction.update({
          where: { id: input.transactionId },
          data: {
            status: 'APPROVED',
            approvedBy: ctx.session.user.id,
            notes: input.notes
          },
          include: { invoice: { include: { subscription: true } } }
        });

        // Update invoice status
        await tx.invoice.update({
          where: { id: transaction.invoiceId },
          data: {
            status: 'PAID',
            paidAt: new Date()
          }
        });

        // Update subscription status if needed
        const subscription = transaction.invoice.subscription;
        if (subscription.status === 'PENDING' || subscription.status === 'PAST_DUE') {
          const now = new Date();
          const nextPeriodEnd = new Date(now);
          nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

          await tx.subscription.update({
            where: { id: subscription.id },
            data: {
              status: 'ACTIVE',
              currentPeriodStart: now,
              currentPeriodEnd: nextPeriodEnd
            }
          });
        }

        return transaction;
      });
    }),

  rejectTransaction: adminProcedure
    .input(
      z.object({
        transactionId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.update({
        where: { id: input.transactionId },
        data: {
          status: 'REJECTED',
          approvedBy: ctx.session.user.id,
          notes: input.notes
        }
      });
    }),
});
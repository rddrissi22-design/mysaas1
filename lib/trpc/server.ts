import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface CreateContextOptions {
  session: Session | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerSession(req, res, authOptions);
  
  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceUserIsAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  // Check if user has admin privileges (simplified - in production you'd check a proper admin role)
  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session.user.id },
    include: { memberships: { include: { org: true } } }
  });
  
  const isAdmin = user?.memberships.some(m => m.role === 'OWNER' || m.role === 'ADMIN');
  
  if (!isAdmin) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
import { createTRPCRouter } from './server';
import { authRouter } from './routers/auth';
import { organizationsRouter } from './routers/organizations';
import { billingRouter } from './routers/billing';
import { appsRouter } from './routers/apps';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  organizations: organizationsRouter,
  billing: billingRouter,
  apps: appsRouter,
});

export type AppRouter = typeof appRouter;
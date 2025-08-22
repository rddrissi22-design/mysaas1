import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { BillingDashboard } from "./billing-dashboard";

interface BillingPageProps {
  params: { slug: string };
}

export default async function BillingPage({ params }: BillingPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const membership = await db.membership.findFirst({
    where: {
      userId: session.user.id,
      org: { slug: params.slug }
    }
  });

  if (!membership) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} orgSlug={params.slug} />
      <BillingDashboard orgId={membership.orgId} />
    </div>
  );
}
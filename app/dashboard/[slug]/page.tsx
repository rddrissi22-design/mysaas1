import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, CreditCard, Users, Calendar } from "lucide-react";

interface OrganizationPageProps {
  params: { slug: string };
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const membership = await db.membership.findFirst({
    where: {
      userId: session.user.id,
      org: { slug: params.slug }
    },
    include: {
      org: {
        include: {
          subscription: true,
          memberships: { include: { user: true } },
          invoices: { 
            orderBy: { createdAt: 'desc' }, 
            take: 5,
            include: { transactions: true }
          }
        }
      }
    }
  });

  if (!membership) {
    redirect("/dashboard");
  }

  const { org } = membership;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'TRIALING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} orgSlug={params.slug} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
            <p className="text-muted-foreground">
              {org.description || "Organization overview and management"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/${params.slug}/settings`}>
                Settings
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/${params.slug}/billing`}>
                Billing
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Subscription Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(org.subscription?.status || 'NONE')}>
                  {org.subscription?.status || 'No subscription'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {org.subscription?.planName || 'No active plan'}
              </p>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{org.memberships.length}</div>
              <p className="text-xs text-muted-foreground">
                Active members
              </p>
            </CardContent>
          </Card>

          {/* Next Billing */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {org.subscription?.currentPeriodEnd 
                  ? new Date(org.subscription.currentPeriodEnd).toLocaleDateString()
                  : "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {org.subscription?.status === 'TRIALING' ? 'Trial ends' : 'Next payment due'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Your latest billing activity</CardDescription>
            </CardHeader>
            <CardContent>
              {org.invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No invoices yet</p>
              ) : (
                <div className="space-y-4">
                  {org.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">#{invoice.number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ${(invoice.amount / 100).toFixed(2)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People in this organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {org.memberships.map((membership) => (
                  <div key={membership.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {membership.user.name || membership.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {membership.user.email}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {membership.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
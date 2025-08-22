import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Building2, CreditCard, Users } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: {
      org: {
        include: {
          subscription: true,
          _count: { select: { memberships: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/new">
              <Plus className="mr-2 h-4 w-4" />
              New Organization
            </Link>
          </Button>
        </div>

        {memberships.length === 0 ? (
          <Card>
            <CardHeader className="text-center py-16">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>No Organizations Yet</CardTitle>
              <CardDescription>
                Create your first organization to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-16">
              <Button asChild size="lg">
                <Link href="/dashboard/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {memberships.map(({ org, role }) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{org.name}</CardTitle>
                      <CardDescription>{org.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {role}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {org._count.memberships} member{org._count.memberships !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {org.subscription?.status || 'No subscription'}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard/${org.slug}`}>
                        View Organization
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
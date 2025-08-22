import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

const availableApps = [
  {
    id: "vibe",
    name: "Vibe",
    description: "AI prompt editor with history and export capabilities",
    icon: Zap,
    href: "/apps/vibe",
    status: "Available"
  },
  // Add more apps here as they're developed
];

export default async function AppsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Apps</h1>
          <p className="text-muted-foreground">
            Discover and use apps to extend your workflow
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableApps.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <app.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription className="text-sm text-green-600">
                        {app.status}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {app.description}
                </p>
                <Button asChild className="w-full">
                  <Link href={app.href}>
                    Launch App <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Coming Soon Card */}
          <Card className="opacity-60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-lg p-2">
                    <Zap className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">More Apps</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Coming Soon
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Additional apps and integrations are being developed. Stay tuned!
              </p>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
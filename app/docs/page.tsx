import { PublicNav } from "@/components/layout/public-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard, Zap, Users, Mail, Shield } from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Multi-tenant Organizations",
    description: "Secure organization-based architecture with role-based access control (OWNER, ADMIN, MEMBER, VIEWER).",
    status: "Production Ready"
  },
  {
    icon: CreditCard,
    title: "Manual Bank Transfer Billing",
    description: "Complete billing lifecycle with invoice generation, payment tracking, and approval workflow.",
    status: "Production Ready"
  },
  {
    icon: Mail,
    title: "Email System",
    description: "Transactional emails with templates, logging, and admin management dashboard.",
    status: "Production Ready"
  },
  {
    icon: Zap,
    title: "Pluggable Apps",
    description: "Extensible architecture to add custom modules and features to your SaaS.",
    status: "Beta"
  },
  {
    icon: Users,
    title: "User Management",
    description: "Complete user authentication with NextAuth, magic links, and Google OAuth.",
    status: "Production Ready"
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-grade security with database-level protections and type safety.",
    status: "Production Ready"
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about building with SaaS Core
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start</CardTitle>
                  <CardDescription>Get up and running in minutes</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Clone the repository and install dependencies</li>
                    <li>Set up your PostgreSQL database</li>
                    <li>Configure environment variables in <code>.env</code></li>
                    <li>Run database migrations with <code>npx prisma migrate dev</code></li>
                    <li>Start the development server with <code>npm run dev</code></li>
                  </ol>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feature) => (
                  <Card key={feature.title}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <feature.icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                        <Badge variant={feature.status === 'Production Ready' ? 'default' : 'secondary'}>
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Architecture</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                  <CardDescription>Modern, production-ready technologies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="font-semibold mb-2">Frontend</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>Next.js 13+ (App Router)</li>
                        <li>TypeScript</li>
                        <li>Tailwind CSS</li>
                        <li>shadcn/ui Components</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Backend</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>tRPC API</li>
                        <li>NextAuth Authentication</li>
                        <li>Prisma ORM</li>
                        <li>PostgreSQL Database</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>Email System</li>
                        <li>Billing & Invoicing</li>
                        <li>Multi-tenancy</li>
                        <li>Role-based Access</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Billing System</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Manual Bank Transfer Flow</CardTitle>
                  <CardDescription>How the billing system works</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Trial Period</h4>
                        <p className="text-sm text-muted-foreground">
                          New organizations start with a 14-day free trial
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Invoice Generation</h4>
                        <p className="text-sm text-muted-foreground">
                          System automatically generates invoices with unique numbers and bank transfer details
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Payment Submission</h4>
                        <p className="text-sm text-muted-foreground">
                          Users submit payment details with bank reference after making transfer
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-primary">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Admin Approval</h4>
                        <p className="text-sm text-muted-foreground">
                          Admins verify and approve payments, automatically updating subscription status
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
              <Card>
                <CardHeader>
                  <CardTitle>tRPC Procedures</CardTitle>
                  <CardDescription>Type-safe API endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Authentication</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground mt-1">
                        <li><code>auth.getSession</code> - Get current user session</li>
                        <li><code>auth.updateProfile</code> - Update user profile</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold">Organizations</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground mt-1">
                        <li><code>organizations.create</code> - Create new organization</li>
                        <li><code>organizations.getUserOrganizations</code> - Get user's organizations</li>
                        <li><code>organizations.getBySlug</code> - Get organization by slug</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold">Billing</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground mt-1">
                        <li><code>billing.getSubscription</code> - Get subscription details</li>
                        <li><code>billing.getInvoices</code> - Get organization invoices</li>
                        <li><code>billing.createTransaction</code> - Submit payment</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
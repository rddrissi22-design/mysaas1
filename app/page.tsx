import Link from "next/link";
import { ArrowRight, Building2, CheckCircle, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/layout/public-nav";
import { config } from "@/lib/config";

const features = [
  {
    name: "Multi-tenant Organizations",
    description: "Secure organization-based architecture with role-based access control.",
    icon: Building2,
  },
  {
    name: "Manual Bank Transfer Billing",
    description: "Complete billing lifecycle with invoice approval workflow and grace periods.",
    icon: CheckCircle,
  },
  {
    name: "Pluggable App System",
    description: "Extensible architecture to add custom modules and features.",
    icon: Zap,
  },
  {
    name: "Enterprise Security",
    description: "Built-in security features with NextAuth and database-level protections.",
    icon: Shield,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <main>
        {/* Hero Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Build Your SaaS
              <span className="text-primary block">Faster Than Ever</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A complete SaaS starter with multi-tenant organizations, manual billing, 
              and extensible app architecture. Focus on your product, not the plumbing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signin">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">View Documentation</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Everything You Need to Launch
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Production-ready features that scale with your business from day one.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.name} className="text-center">
                  <div className="bg-primary/10 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are building the next generation of SaaS applications.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/signin">
                Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Building2 className="h-5 w-5" />
              <span className="font-semibold">{config.productName}</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">
                Documentation
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 {config.productName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicNav } from "@/components/layout/public-nav";
import { config } from "@/lib/config";

const features = [
  "Multi-tenant organizations",
  "Unlimited team members", 
  "Manual bank transfer billing",
  "Email notifications",
  "24/7 support",
  "Custom branding",
  "API access",
  "Advanced analytics",
];

export default function PricingPage() {
  const monthlyPrice = config.billing.plans.pro.monthlyPrice / 100;
  const yearlyPrice = config.billing.plans.pro.yearlyPrice / 100;
  const yearlyMonthlyEquivalent = yearlyPrice / 12;
  const savings = Math.round((1 - yearlyMonthlyEquivalent / monthlyPrice) * 100);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <main className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with a free trial, then choose the plan that works for your team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Monthly</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">${monthlyPrice}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/auth/signin">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="relative border-primary">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Save {savings}%
                </span>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Yearly</CardTitle>
                <CardDescription>Best value for growing teams</CardDescription>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">${yearlyPrice}</span>
                  <span className="text-muted-foreground ml-1">/year</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${yearlyMonthlyEquivalent.toFixed(2)} per month
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/auth/signin">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold mb-2">Start Free Trial</h4>
                <p className="text-sm text-muted-foreground">
                  14 days free, no credit card required
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold mb-2">Get Invoice</h4>
                <p className="text-sm text-muted-foreground">
                  We'll send you an invoice with bank transfer details
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold mb-2">Transfer Payment</h4>
                <p className="text-sm text-muted-foreground">
                  Make the bank transfer and we'll activate your subscription
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              Questions about pricing? Need a custom plan?
            </p>
            <Button variant="outline" asChild>
              <Link href={`mailto:${config.supportEmail}`}>Contact Sales</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
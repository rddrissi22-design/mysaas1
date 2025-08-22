import { PublicNav } from "@/components/layout/public-nav";
import { config } from "@/lib/config";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-gray">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using {config.productName}, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
          
          <h2>2. Service Description</h2>
          <p>
            {config.productName} is a software-as-a-service platform that provides multi-tenant 
            organization management, billing, and application hosting capabilities.
          </p>
          
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the service, you may be required to create an account. 
            You are responsible for maintaining the confidentiality of your account information.
          </p>
          
          <h2>4. Billing and Payment</h2>
          <p>
            Our service uses manual bank transfer billing. Invoices will be generated automatically 
            and payment must be made via bank transfer using the provided details.
          </p>
          
          <h2>5. Trial Period</h2>
          <p>
            New organizations receive a 14-day free trial. After the trial period, continued use 
            requires an active paid subscription.
          </p>
          
          <h2>6. Acceptable Use</h2>
          <p>
            You agree not to use the service for any unlawful purpose or in any way that could 
            damage, disable, or impair the service.
          </p>
          
          <h2>7. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs 
            your use of the service.
          </p>
          
          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account at any time, with or without notice, for 
            violations of these terms.
          </p>
          
          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall {config.productName} be liable for any indirect, incidental, 
            special, or consequential damages.
          </p>
          
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of 
            any changes by posting the new terms on this page.
          </p>
          
          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
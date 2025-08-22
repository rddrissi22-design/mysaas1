export const config = {
  productName: process.env.NEXT_PUBLIC_PRODUCT_NAME || "SaaS Core",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Bank transfer details
  bankDetails: {
    accountName: "SaaS Core Ltd",
    accountNumber: "12345678",
    routingNumber: "987654321",
    bankName: "Example Bank",
    instructions: "Please include your invoice number in the payment reference"
  },
  
  // Billing configuration
  billing: {
    gracePeriodDays: 7,
    trialDays: 14,
    plans: {
      pro: {
        name: "Pro Plan",
        monthlyPrice: 2900, // $29.00 in cents
        yearlyPrice: 29000, // $290.00 in cents (save 2 months)
      }
    }
  },
  
  // Theme colors (can be overridden per vertical)
  theme: {
    primary: "hsl(221.2, 83.2%, 53.3%)", // Blue
    secondary: "hsl(142.1, 76.2%, 36.3%)", // Emerald
    accent: "hsl(38.1, 92.1%, 50%)", // Amber
  }
};
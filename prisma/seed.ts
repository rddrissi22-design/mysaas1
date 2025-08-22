import { PrismaClient } from '@prisma/client';
import { config } from '../lib/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
      marketingOptIn: true,
      theme: 'system',
    },
  });

  console.log('👤 Created demo user:', demoUser.email);

  // Create a demo organization
  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'demo-corp' },
    update: {},
    create: {
      name: 'Demo Corp',
      slug: 'demo-corp',
      description: 'A demonstration organization for testing purposes',
      createdById: demoUser.id,
    },
  });

  console.log('🏢 Created demo organization:', demoOrg.name);

  // Create membership
  await prisma.membership.upsert({
    where: {
      userId_orgId: {
        userId: demoUser.id,
        orgId: demoOrg.id,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      orgId: demoOrg.id,
      role: 'OWNER',
    },
  });

  console.log('🔐 Created membership for demo user');

  // Create subscription
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);

  const subscription = await prisma.subscription.upsert({
    where: { orgId: demoOrg.id },
    update: {},
    create: {
      orgId: demoOrg.id,
      status: 'TRIALING',
      planName: config.billing.plans.pro.name,
      amount: config.billing.plans.pro.monthlyPrice,
      currency: 'USD',
      billingInterval: 'monthly',
      trialEndsAt: trialEndDate,
      autoRenewal: true,
    },
  });

  console.log('💳 Created subscription for demo organization');

  // Create a sample invoice
  const invoiceDueDate = new Date();
  invoiceDueDate.setDate(invoiceDueDate.getDate() + 30);

  const invoice = await prisma.invoice.create({
    data: {
      number: `INV-${Date.now()}`,
      orgId: demoOrg.id,
      subscriptionId: subscription.id,
      status: 'PENDING',
      amount: config.billing.plans.pro.monthlyPrice,
      currency: 'USD',
      description: 'Monthly subscription - Pro Plan',
      dueDate: invoiceDueDate,
    },
  });

  console.log('🧾 Created sample invoice:', invoice.number);

  // Create some sample Vibe prompts
  await prisma.vibePrompt.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Welcome Message',
        content: 'Write a welcome message for new users joining our SaaS platform',
        response: 'Welcome to our platform! We\'re excited to have you join our community. Here\'s how to get started: 1) Complete your profile, 2) Explore the dashboard, 3) Check out our documentation. If you need any help, our support team is here for you!',
      },
      {
        userId: demoUser.id,
        title: 'Feature Announcement',
        content: 'Create an announcement for a new billing feature',
        response: '🎉 New Feature Alert: Enhanced Billing Dashboard\n\nWe\'ve just launched our new billing dashboard with improved invoice management, payment tracking, and subscription insights. You can now:\n\n• View detailed payment history\n• Download invoices as PDFs\n• Set up payment reminders\n• Track subscription metrics\n\nCheck it out in your account settings!',
      },
    ],
  });

  console.log('✨ Created sample Vibe prompts');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
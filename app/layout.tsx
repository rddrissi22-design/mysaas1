import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import { SessionProvider } from 'next-auth/react';
import { authOptions } from '@/lib/auth';
import { TRPCProvider } from '@/components/providers/trpc-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from "@/components/ui/sonner"
import { config } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: config.productName,
    template: `%s | ${config.productName}`,
  },
  description: 'A comprehensive SaaS starter with manual billing and multi-tenant support',
  keywords: ['SaaS', 'Next.js', 'TypeScript', 'Prisma', 'tRPC'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCProvider>
              {children}
              <Toaster richColors />
            </TRPCProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
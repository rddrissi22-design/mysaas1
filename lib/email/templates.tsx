import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { config } from '@/lib/config';

interface EmailProps {
  organizationName?: string;
  userName?: string;
  invoiceNumber?: string;
  amount?: string;
  dueDate?: string;
}

export const SubscriptionCreatedEmail = ({ organizationName, userName }: EmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to {config.productName}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={title}>{config.productName}</Text>
        </Section>
        <Section style={content}>
          <Text style={greeting}>Hi {userName},</Text>
          <Text style={paragraph}>
            Welcome to {config.productName}! Your organization "{organizationName}" has been created successfully.
          </Text>
          <Text style={paragraph}>
            You're currently on a 14-day free trial. We'll send you a reminder before it expires.
          </Text>
          <Text style={paragraph}>
            If you have any questions, feel free to reach out to us at{' '}
            <Link href={`mailto:${config.supportEmail}`}>{config.supportEmail}</Link>
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>
            © 2024 {config.productName}. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const InvoicePendingEmail = ({ 
  organizationName, 
  userName, 
  invoiceNumber, 
  amount, 
  dueDate 
}: EmailProps) => (
  <Html>
    <Head />
    <Preview>Invoice {invoiceNumber} - Payment Required</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={title}>{config.productName}</Text>
        </Section>
        <Section style={content}>
          <Text style={greeting}>Hi {userName},</Text>
          <Text style={paragraph}>
            Your invoice {invoiceNumber} for "{organizationName}" is ready for payment.
          </Text>
          <Section style={invoiceDetails}>
            <Text style={detailLabel}>Amount Due: <strong>{amount}</strong></Text>
            <Text style={detailLabel}>Due Date: <strong>{dueDate}</strong></Text>
          </Section>
          <Text style={paragraph}>
            Please transfer the payment to our bank account using the details below:
          </Text>
          <Section style={bankDetails}>
            <Text style={bankLabel}>Bank: {config.bankDetails.bankName}</Text>
            <Text style={bankLabel}>Account: {config.bankDetails.accountName}</Text>
            <Text style={bankLabel}>Number: {config.bankDetails.accountNumber}</Text>
            <Text style={bankLabel}>Routing: {config.bankDetails.routingNumber}</Text>
            <Text style={bankLabel}>Reference: {invoiceNumber}</Text>
          </Section>
          <Text style={paragraph}>
            {config.bankDetails.instructions}
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>
            © 2024 {config.productName}. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const header = {
  borderBottom: '1px solid #eaeaea',
  paddingBottom: '20px',
};

const title = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000',
  textAlign: 'center' as const,
};

const content = {
  padding: '20px 0',
};

const greeting = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#000',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#666',
};

const invoiceDetails = {
  background: '#f6f9fc',
  border: '1px solid #e6ebf1',
  borderRadius: '4px',
  padding: '16px',
  margin: '16px 0',
};

const bankDetails = {
  background: '#fafafa',
  border: '1px solid #e1e1e1',
  borderRadius: '4px',
  padding: '16px',
  margin: '16px 0',
};

const detailLabel = {
  fontSize: '14px',
  margin: '4px 0',
  color: '#000',
};

const bankLabel = {
  fontSize: '12px',
  margin: '2px 0',
  color: '#333',
  fontFamily: 'monospace',
};

const footer = {
  borderTop: '1px solid #eaeaea',
  paddingTop: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#666',
};
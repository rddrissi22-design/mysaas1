"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/trpc/client";
import { config } from "@/lib/config";
import { toast } from "sonner";
import { CreditCard, Copy, DollarSign, FileText } from "lucide-react";

interface BillingDashboardProps {
  orgId: string;
}

export function BillingDashboard({ orgId }: BillingDashboardProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<string>("");
  const [bankReference, setBankReference] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const { data: subscription } = api.billing.getSubscription.useQuery({ orgId });
  const { data: invoices } = api.billing.getInvoices.useQuery({ orgId });

  const createTransaction = api.billing.createTransaction.useMutation({
    onSuccess: () => {
      toast.success("Payment submitted for review");
      setBankReference("");
      setAmount("");
      setNotes("");
      setSelectedInvoice("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit payment");
    },
  });

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    createTransaction.mutate({
      invoiceId: selectedInvoice,
      bankReference,
      amount: parseInt(amount) * 100, // Convert to cents
      notes,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'TRIALING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and payment methods
          </p>
        </div>
      </div>

      {/* Subscription Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(subscription?.status || 'NONE')}>
              {subscription?.status || 'No subscription'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {subscription?.planName || 'No active plan'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${subscription ? (subscription.amount / 100).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              per {subscription?.billingInterval || 'month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription?.currentPeriodEnd 
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : subscription?.trialEndsAt
                ? new Date(subscription.trialEndsAt).toLocaleDateString()
                : "N/A"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {subscription?.status === 'TRIALING' ? 'Trial ends' : 'Payment due'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bank Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bank Transfer Details</CardTitle>
          <CardDescription>
            Use these details to make your payment via bank transfer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Bank Name</Label>
                <div className="flex items-center justify-between mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {config.bankDetails.bankName}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(config.bankDetails.bankName)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Account Name</Label>
                <div className="flex items-center justify-between mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {config.bankDetails.accountName}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(config.bankDetails.accountName)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Account Number</Label>
                <div className="flex items-center justify-between mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {config.bankDetails.accountNumber}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(config.bankDetails.accountNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Routing Number</Label>
                <div className="flex items-center justify-between mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {config.bankDetails.routingNumber}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(config.bankDetails.routingNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
            <p className="text-sm font-medium text-blue-900 mb-1">Payment Instructions</p>
            <p className="text-sm text-blue-700">{config.bankDetails.instructions}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Your billing history and payments</CardDescription>
          </div>
          {invoices?.some(i => i.status === 'PENDING') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Submit Payment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Bank Transfer</DialogTitle>
                  <DialogDescription>
                    Let us know you've made a payment and we'll verify it
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div>
                    <Label htmlFor="invoice">Invoice</Label>
                    <select
                      id="invoice"
                      value={selectedInvoice}
                      onChange={(e) => setSelectedInvoice(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select an invoice</option>
                      {invoices?.filter(i => i.status === 'PENDING').map((invoice) => (
                        <option key={invoice.id} value={invoice.id}>
                          #{invoice.number} - ${(invoice.amount / 100).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="reference">Bank Reference</Label>
                    <Input
                      id="reference"
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                      placeholder="Transaction reference from your bank"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount Paid ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional information..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={createTransaction.isLoading}>
                      Submit Payment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {invoices?.length === 0 ? (
            <p className="text-muted-foreground">No invoices yet</p>
          ) : (
            <div className="space-y-4">
              {invoices?.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">#{invoice.number}</p>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                    {invoice.transactions.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {invoice.transactions.length} transaction(s) submitted
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(invoice.amount / 100).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
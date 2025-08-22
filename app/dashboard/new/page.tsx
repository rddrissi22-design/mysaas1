"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/trpc/client";
import { toast } from "sonner";

export default function NewOrganizationPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const createOrg = api.organizations.create.useMutation({
    onSuccess: (org) => {
      toast.success("Organization created successfully!");
      router.push(`/dashboard/${org.slug}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create organization");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrg.mutate({ name, slug, description });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name
    const newSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setSlug(newSlug);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>
            Start building your next project with a new organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Acme Inc"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                type="text"
                placeholder="acme-inc"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be used in your organization URL
              </p>
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your organization..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createOrg.isLoading}
              >
                Create Organization
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/trpc/client";
import { toast } from "sonner";
import { Plus, History, Download, MoreHorizontal, Trash2, Edit, Zap } from "lucide-react";

export function VibeApp() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);

  const { data: prompts, refetch } = api.apps.getVibePrompts.useQuery();
  
  const createPrompt = api.apps.createVibePrompt.useMutation({
    onSuccess: () => {
      toast.success("Prompt created successfully!");
      setTitle("");
      setContent("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create prompt");
    },
  });

  const updatePrompt = api.apps.updateVibePrompt.useMutation({
    onSuccess: () => {
      toast.success("Prompt updated successfully!");
      setEditingPrompt(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update prompt");
    },
  });

  const deletePrompt = api.apps.deleteVibePrompt.useMutation({
    onSuccess: () => {
      toast.success("Prompt deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete prompt");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createPrompt.mutate({ title, content });
  };

  const handleEdit = (prompt: any) => {
    setTitle(prompt.title);
    setContent(prompt.content);
    setEditingPrompt(prompt.id);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrompt) return;

    updatePrompt.mutate({
      id: editingPrompt,
      title,
      content,
    });
  };

  const exportToJSON = (prompt: any) => {
    const data = {
      title: prompt.title,
      content: prompt.content,
      response: prompt.response,
      createdAt: prompt.createdAt,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prompt.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToMarkdown = (prompt: any) => {
    const markdown = `# ${prompt.title}

## Prompt
${prompt.content}

## Response
${prompt.response}

---
Created: ${new Date(prompt.createdAt).toLocaleString()}
`;
    
    const blob = new Blob([markdown], {
      type: "text/markdown",
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prompt.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vibe</h1>
            <p className="text-muted-foreground">
              AI prompt editor with history and export capabilities
            </p>
          </div>
        </div>
        <Badge variant="secondary">Demo App</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Prompt Editor */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPrompt ? "Edit Prompt" : "Create New Prompt"}
            </CardTitle>
            <CardDescription>
              {editingPrompt 
                ? "Make changes to your existing prompt"
                : "Write your prompt and get an AI response"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingPrompt ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your prompt a title..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">Prompt</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your prompt here..."
                  rows={6}
                  required
                />
              </div>
              
              <div className="flex gap-3">
                {editingPrompt && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingPrompt(null);
                      setTitle("");
                      setContent("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={createPrompt.isLoading || updatePrompt.isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {editingPrompt ? "Update" : "Create"} Prompt
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Prompt History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prompt History</CardTitle>
                <CardDescription>Your previous prompts and responses</CardDescription>
              </div>
              <History className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {!prompts || prompts.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No prompts yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first prompt to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {prompts.map((prompt) => (
                  <Card key={prompt.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{prompt.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(prompt)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportToJSON(prompt)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export JSON
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportToMarkdown(prompt)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Markdown
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deletePrompt.mutate({ id: prompt.id })}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          PROMPT:
                        </p>
                        <p className="text-sm bg-muted p-2 rounded text-wrap break-words">
                          {prompt.content}
                        </p>
                      </div>
                      
                      {prompt.response && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            RESPONSE:
                          </p>
                          <p className="text-sm bg-blue-50 p-2 rounded text-wrap break-words">
                            {prompt.response}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(prompt.createdAt).toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
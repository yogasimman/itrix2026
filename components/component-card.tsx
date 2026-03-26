"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, Unlock, Cpu, Copy, Check } from "lucide-react";

interface ComponentCardProps {
  component: {
    id: number;
    name: string;
    description: string;
    pinout: string;
    category: string;
    code_snippet: string;
    is_unlocked?: number;
    component_hint_penalty?: number;
    setup_instructions?: string;
    connection_diagram?: string;
    warnings?: string[];
    required_libraries?: string[];
    complexity_level?: "Beginner" | "Intermediate" | "Advanced";
  };
  participantId: string;
  isLocked: boolean;
  onUnlock: (componentId: number) => Promise<void>;
}

export function ComponentCard({
  component,
  participantId,
  isLocked,
  onUnlock,
}: ComponentCardProps) {
  const [isUnlocked, setIsUnlocked] = useState(!!component.is_unlocked);
  const [snippet, setSnippet] = useState<string | null>(
    component.is_unlocked ? component.code_snippet : null
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUnlock = async () => {
    if (isLocked || isUnlocked) return;

    setLoading(true);
    try {
      const res = await fetch("/api/snippets/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          componentId: component.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsUnlocked(true);
        setSnippet(data.snippet || component.code_snippet);
        await onUnlock(component.id);
      }
    } catch (error) {
      console.error("Failed to unlock snippet:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (snippet) {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="relative overflow-hidden border-cyan-200/20 bg-slate-950/60 backdrop-blur-lg transition-colors hover:border-cyan-300/45">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10">
              <Cpu className="h-4 w-4 text-cyan-200" />
            </div>
            <CardTitle className="text-sm font-medium leading-tight text-cyan-50">
              {component.name}
            </CardTitle>
          </div>
          <Badge
            variant={isUnlocked ? "default" : "secondary"}
            className={`shrink-0 text-xs ${isUnlocked ? "bg-emerald-400/20 text-emerald-100" : "bg-slate-800 text-cyan-100/80"}`}
          >
            {isUnlocked ? "Unlocked" : "Locked"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-cyan-100/75">{component.description}</p>

        <div className="rounded-lg border border-cyan-200/15 bg-slate-900/55 p-3">
          <p className="mb-1 text-xs font-medium text-cyan-100/70">
            Pin Configuration
          </p>
          <p className="text-xs font-mono text-cyan-50">{component.pinout}</p>
        </div>

        <Badge variant="outline" className="text-xs border-cyan-200/30 text-cyan-100">
          {component.category}
        </Badge>
        {typeof component.component_hint_penalty === "number" && (
          <Badge variant="outline" className="text-xs border-amber-300/35 text-amber-100">
            Penalty on access: {component.component_hint_penalty}
          </Badge>
        )}

        {isUnlocked && snippet ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Unlock className="mr-2 h-3 w-3" />
                View Code Snippet
              </Button>
            </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-2xl border-cyan-200/20 bg-slate-950/95 text-cyan-50">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  {component.name} - Starter Guidance Pack
                </DialogTitle>
                <DialogDescription>
                  Use this as a basic reference. Final implementation logic must be written by the participant.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 rounded border border-cyan-200/20 bg-slate-900/70 p-3 text-xs text-cyan-100/80">
                {component.complexity_level && <p>Complexity: {component.complexity_level}</p>}
                {component.required_libraries && component.required_libraries.length > 0 && (
                  <p>Libraries: {component.required_libraries.join(", ")}</p>
                )}
                {component.connection_diagram && <p>Connection: {component.connection_diagram}</p>}
                {component.setup_instructions && <p>Setup: {component.setup_instructions}</p>}
                {component.warnings && component.warnings.length > 0 && (
                  <p>Warnings: {component.warnings.join(" | ")}</p>
                )}
              </div>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2 z-10"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <pre className="max-h-[50vh] overflow-auto rounded-lg border border-cyan-200/20 bg-slate-900 p-4 text-xs text-cyan-100">
                  <code>{snippet}</code>
                </pre>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={handleUnlock}
            disabled={isLocked || loading}
          >
            {loading ? (
              "Unlocking..."
            ) : isLocked ? (
              <>
                <Lock className="mr-2 h-3 w-3" />
                Dashboard Locked
              </>
            ) : (
              <>
                <Lock className="mr-2 h-3 w-3" />
                Unlock Starter Hint Pack
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

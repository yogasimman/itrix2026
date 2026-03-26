"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";

interface GeneratedQuestion {
  id: string;
  title: string;
  scenario: string;
  section: "A" | "B" | "C" | "D";
  difficulty: "Easy" | "Medium" | "Hard";
  type: "mcq" | "multi-select" | "matching" | "logic";
  options?: Array<{ text: string; isCorrect: boolean }>;
  correctAnswer?: string | string[];
  explanation?: string;
  score: number;
}

interface AIQuestionGeneratorProps {
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => Promise<void> | void;
}

export function AIQuestionGenerator({ onQuestionsGenerated }: AIQuestionGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/round1/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_curated_round1_pool" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate question pool");
      }
      setGeneratedQuestions(data.questions || []);
      await onQuestionsGenerated(data.questions || []);
    } catch (error) {
      console.error("Failed to generate questions:", error);
      setError("Unable to generate curated Round 1 question pool right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Curated Pool
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Curated Round 1 Generator</DialogTitle>
          <DialogDescription>
            Generate a fresh curated IoT pool with mixed MCQ difficulty, scenario
            questions, plus dedicated connection-evaluation and basic coding segments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 text-sm text-muted-foreground">
            This replaces existing Round 1 questions with a newly generated
            curated Round 1 pool based on event rules. Manual question entry is disabled.
          </Card>

          {!!error && <p className="text-sm text-destructive">{error}</p>}

          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Generated Questions ({generatedQuestions.length})
                </h3>
                <Button variant="outline" size="sm" onClick={generateQuestions} disabled={loading}>
                  Regenerate
                </Button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {generatedQuestions.map((q) => (
                  <Card key={q.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{q.title}</h4>
                        <div className="flex gap-1">
                          <Badge variant="outline">{q.section}</Badge>
                          <Badge variant={q.difficulty === "Easy" ? "secondary" : q.difficulty === "Medium" ? "outline" : "destructive"}>
                            {q.difficulty}
                          </Badge>
                          <Badge>{q.score} pts</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{q.scenario}</p>
                    </div>
                  </Card>
                ))}
              </div>

            </div>
          )}

          <Button onClick={generateQuestions} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating IoT Pool...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Curated Round 1 Questions
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

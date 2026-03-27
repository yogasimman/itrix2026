"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, BarChart3, Eye } from "lucide-react";
import { AIQuestionGenerator } from "./ai-question-generator";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface QuestionData {
  id: number;
  title: string;
  type: string;
  section: string;
  difficulty: string;
  score: number;
  timeLimit: number;
  scenario?: string;
  options?: Array<{ id: string; text: string }>;
  matchingPairs?: Array<{ id: string; left: string; right: string }>;
  correctAnswer?: string | string[];
  sourceNodes?: string[];
  targetNodes?: string[];
  expectedConnections?: Array<{ from: string; to: string }>;
}

export function Round1QuestionManager() {
  const { data: questionsData, mutate: refreshQuestions } = useSWR(
    "/api/round1/questions",
    fetcher,
    { refreshInterval: 5000 }
  );
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<QuestionData | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);

  const handleDeleteQuestion = async (id: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await fetch(`/api/round1/questions?id=${id}`, { method: "DELETE" });
        refreshQuestions();
      } catch (error) {
        console.error("Failed to delete question:", error);
      }
    }
  };

  const questions: QuestionData[] = questionsData?.questions || [];

  const allSelected = useMemo(
    () => questions.length > 0 && selectedQuestionIds.length === questions.length,
    [questions.length, selectedQuestionIds.length]
  );

  const toggleQuestionSelection = (id: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedQuestionIds(allSelected ? [] : questions.map((q) => q.id));
  };

  const handleBulkDelete = async () => {
    if (selectedQuestionIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedQuestionIds.length} selected question(s)?`)) return;

    try {
      await Promise.all(
        selectedQuestionIds.map((id) =>
          fetch(`/api/round1/questions?id=${id}`, { method: "DELETE" })
        )
      );
      setSelectedQuestionIds([]);
      refreshQuestions();
    } catch (error) {
      console.error("Failed to delete selected questions:", error);
    }
  };

  const loadQuestionDetails = async (id: number) => {
    setQuestionLoading(true);
    setQuestionDialogOpen(true);
    try {
      const res = await fetch(`/api/round1/questions?id=${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch question details");
      }
      const data = await res.json();
      setActiveQuestion(data.question || null);
    } catch (error) {
      console.error("Failed to load question details:", error);
      setActiveQuestion(null);
    } finally {
      setQuestionLoading(false);
    }
  };

  const formatCorrectAnswer = (question: QuestionData | null): string => {
    if (!question) return "-";
    const answer = question.correctAnswer;
    if (Array.isArray(answer)) return answer.join(", ");
    if (answer !== undefined && answer !== null) {
      if (typeof answer === "string") {
        try {
          const parsed = JSON.parse(answer);
          if (Array.isArray(parsed)) return parsed.join(", ");
          if (typeof parsed === "object") return JSON.stringify(parsed, null, 2);
        } catch {
          return answer;
        }
      }
      return String(answer);
    }
    return "-";
  };

  if (!questionsData) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: questions.length,
    sectionA: questions.filter((q: QuestionData) => q.section === "A").length,
    sectionB: questions.filter((q: QuestionData) => q.section === "B").length,
    sectionC: questions.filter((q: QuestionData) => q.section === "C").length,
    sectionD: questions.filter((q: QuestionData) => q.section === "D").length,
    totalScore: questions.reduce((sum: number, q: QuestionData) => sum + q.score, 0),
  };

  return (
    <div className="space-y-6">
      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="max-h-[88vh] w-[96vw] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Round 1 Question Details</DialogTitle>
            <DialogDescription>
              View full question statement, options, and expected answer.
            </DialogDescription>
          </DialogHeader>

          {questionLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : !activeQuestion ? (
            <p className="text-sm text-muted-foreground">Unable to load question details.</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid gap-2 md:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Question ID</p>
                  <p className="font-mono font-semibold">{activeQuestion.id}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Section</p>
                  <p className="font-semibold">{activeQuestion.section}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-semibold">{activeQuestion.type}</p>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Title</p>
                <p className="font-medium">{activeQuestion.title}</p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Question / Scenario Text</p>
                <p className="whitespace-pre-wrap leading-relaxed">{activeQuestion.scenario || "-"}</p>
              </div>

              {activeQuestion.options && activeQuestion.options.length > 0 ? (
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-2">Answer Options</p>
                  <div className="space-y-2">
                    {activeQuestion.options.map((option) => (
                      <div key={option.id} className="rounded border bg-muted/40 px-3 py-2">
                        <span className="font-mono text-xs mr-2">{option.id}.</span>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeQuestion.matchingPairs && activeQuestion.matchingPairs.length > 0 ? (
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-2">Matching Pairs</p>
                  <div className="space-y-2">
                    {activeQuestion.matchingPairs.map((pair) => (
                      <div key={pair.id} className="rounded border bg-muted/40 px-3 py-2">
                        <span className="font-medium">{pair.left}</span>
                        <span className="mx-2 text-muted-foreground">-&gt;</span>
                        <span>{pair.right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeQuestion.sourceNodes?.length || activeQuestion.targetNodes?.length ? (
                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Connection Nodes</p>
                  <p><span className="font-medium">Source:</span> {(activeQuestion.sourceNodes || []).join(", ") || "-"}</p>
                  <p><span className="font-medium">Target:</span> {(activeQuestion.targetNodes || []).join(", ") || "-"}</p>
                </div>
              ) : null}

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Correct Answer</p>
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{formatCorrectAnswer(activeQuestion)}</pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Q</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        {["A", "B", "C", "D"].map((section) => (
          <Card key={section}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Section {section}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats[`section${section}` as keyof typeof stats]}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Max Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScore}</div>
          </CardContent>
        </Card>
      </div>

      {/* Question Manager */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Round 1 Questions</CardTitle>
            <CardDescription>
              Curated IoT-only pool for Round 1 (manual entry disabled)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={selectedQuestionIds.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedQuestionIds.length})
            </Button>
            <AIQuestionGenerator
              onQuestionsGenerated={async () => {
                setSelectedQuestionIds([]);
                refreshQuestions();
              }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[48px]">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all questions"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question: QuestionData) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedQuestionIds.includes(question.id)}
                        onCheckedChange={() => toggleQuestionSelection(question.id)}
                        aria-label={`Select question ${question.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{question.id}</TableCell>
                    <TableCell>{question.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{question.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Section {question.section}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          question.difficulty === "Easy"
                            ? "outline"
                            : question.difficulty === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{question.score}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {question.timeLimit}s
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadQuestionDetails(question.id)}
                          title="View full question"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {questions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No Round 1 questions yet. Generate the curated Round 1 pool.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, BarChart3 } from "lucide-react";
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
}

export function Round1QuestionManager() {
  const { data: questionsData, mutate: refreshQuestions } = useSWR(
    "/api/round1/questions",
    fetcher,
    { refreshInterval: 5000 }
  );
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

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

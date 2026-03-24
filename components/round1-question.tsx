"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Round1QuestionProps {
  question: {
    id: number;
    type: string;
    title: string;
    scenario: string;
    section: string;
    difficulty: string;
    score: number;
    timeLimit: number;
    options?: Array<{ id: string; text: string }>;
    matchingPairs?: Array<{ id: string; left: string; right: string }>;
  };
  questionNumber: number;
  totalQuestions: number;
  currentAnswer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isSaving?: boolean;
}

export function Round1Question({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswerChange,
  onPrevious,
  onNext,
  isSaving = false,
}: Round1QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(
    typeof currentAnswer === "string" ? currentAnswer : ""
  );
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : []
  );
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof currentAnswer === "string") {
      if (question.type === "matching" || question.type === "component-matching") {
        try {
          const parsed = JSON.parse(currentAnswer);
          setMatchingAnswers(parsed && typeof parsed === "object" ? parsed : {});
        } catch {
          setMatchingAnswers({});
        }
        setSelectedAnswer("");
        setSelectedAnswers([]);
      } else {
        setSelectedAnswer(currentAnswer);
        setSelectedAnswers([]);
        setMatchingAnswers({});
      }
      return;
    }

    if (Array.isArray(currentAnswer)) {
      setSelectedAnswers(currentAnswer);
      setSelectedAnswer("");
      setMatchingAnswers({});
      return;
    }

    setSelectedAnswer("");
    setSelectedAnswers([]);
    setMatchingAnswers({});
  }, [currentAnswer, question.type, question.id]);

  const matchingCompleted = useMemo(
    () => Object.keys(matchingAnswers).length === (question.matchingPairs?.length || 0),
    [matchingAnswers, question.matchingPairs]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </p>
          <Progress value={(questionNumber / totalQuestions) * 100} className="mt-2" />
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">{question.title}</CardTitle>
              <CardDescription className="mt-2">{question.scenario}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">Section {question.section}</Badge>
              <Badge variant="secondary">{question.score} pts</Badge>
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
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* MCQ / Simulation Type */}
          {(question.type === "mcq" || question.type === "simulation") && (
            <RadioGroup
              value={selectedAnswer}
              onValueChange={(value) => {
                setSelectedAnswer(value);
                onAnswerChange(value);
              }}
            >
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {/* Multi-Select Type */}
          {question.type === "multi-select" && (
            <div className="space-y-3">
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                  <Checkbox
                    id={option.id}
                    checked={selectedAnswers.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const next = [...selectedAnswers, option.id];
                        setSelectedAnswers(next);
                        onAnswerChange(next);
                      } else {
                        const next = selectedAnswers.filter((a) => a !== option.id);
                        setSelectedAnswers(next);
                        onAnswerChange(next);
                      }
                    }}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer flex-1">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Matching Type */}
          {(question.type === "matching" || question.type === "component-matching") && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Left Items</h4>
                {question.matchingPairs?.map((pair) => (
                  <div key={`left-${pair.id}`} className="p-3 rounded-lg border bg-card text-sm space-y-2">
                    <div className="font-medium">{pair.left}</div>
                    <select
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={matchingAnswers[pair.id] || ""}
                      onChange={(e) => {
                        const rightId = e.target.value;
                        const next = {
                          ...matchingAnswers,
                          [pair.id]: rightId,
                        };
                        setMatchingAnswers(next);
                        onAnswerChange(JSON.stringify(next));
                      }}
                    >
                      <option value="">Select matching right item</option>
                      {question.matchingPairs?.map((rightPair) => (
                        <option key={`option-${pair.id}-${rightPair.id}`} value={rightPair.id}>
                          {rightPair.right}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Right Items</h4>
                {question.matchingPairs?.map((pair) => (
                  <div key={`right-${pair.id}`} className="p-3 rounded-lg bg-muted text-sm">
                    {pair.right}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {(question.type === "matching" || question.type === "component-matching")
                ? matchingCompleted
                  ? "All matches selected"
                  : "Select all matches to complete this question"
                : "Answer auto-saves on selection"}
            </span>
            <span>{isSaving ? "Saving..." : "Saved"}</span>
          </div>

          {/* Navigation only */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={!onPrevious || isSaving}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onNext}
              disabled={!onNext || isSaving}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

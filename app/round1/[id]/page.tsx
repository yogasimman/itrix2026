"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Round1Question } from "@/components/round1-question";
import { Round1Results } from "@/components/round1-results";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, Brain } from "lucide-react";

interface Round1QuestionData {
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
  correctAnswer?: string | string[];
}

interface Round1Session {
  started_at: string;
  expires_at: string;
}

export default function Round1QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: participantId } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'loading' | 'started' | 'completed'>('loading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Round1QuestionData[]>([]);
  const [session, setSession] = useState<Round1Session | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(3600);
  const [result, setResult] = useState<any>(null);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<number, string | string[]>>({});
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  useEffect(() => {
    const initRound1 = async () => {
      try {
        const res = await fetch(`/api/round1/questions?participantId=${participantId}&action=start`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to initialize Round 1");
          setIsLoading(false);
          return;
        }

        if (!data?.questions || data.questions.length === 0) {
          setError("No AI-generated Round 1 questions available.");
          setIsLoading(false);
          return;
        }

        setSession(data.session);
        setQuestions(data.questions);

        const responses = data.responses || [];
        const existingAnswers: Record<number, string | string[]> = {};
        responses.forEach((r: any) => {
          existingAnswers[r.question_id] = r.answer;
        });
        setAnswersByQuestionId(existingAnswers);
        const answeredQuestionIds = new Set(responses.map((r: any) => r.question_id));
        const nextIndex = data.questions.findIndex((q: Round1QuestionData) => !answeredQuestionIds.has(q.id));
        setCurrentQuestionIndex(nextIndex === -1 ? data.questions.length : nextIndex);

        setQuizState('started');
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Round 1:', err);
        setError('Failed to initialize quiz');
        setIsLoading(false);
      }
    };

    if (participantId) initRound1();
  }, [participantId]);

  useEffect(() => {
    if (!session || quizState !== "started") return;
    const tick = () => {
      const left = Math.max(
        0,
        Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000)
      );
      setRemainingSeconds(left);
      if (left <= 0) {
        submitRound();
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [session, quizState]);

  const submitRound = useCallback(async () => {
    if (isFinalizing) return;
    setIsFinalizing(true);
    const resultRes = await fetch(
      `/api/round1/responses?participantId=${participantId}&action=submit`
    );
    const resultData = await resultRes.json();
    if (resultData?.result) {
      setResult(resultData.result);
      setQuizState("completed");
    }
    setIsFinalizing(false);
  }, [participantId, isFinalizing]);

  useEffect(() => {
    if (quizState === "started" && questions.length > 0 && currentQuestionIndex >= questions.length) {
      submitRound();
    }
  }, [quizState, questions.length, currentQuestionIndex, submitRound]);

  const handleAnswerChange = useCallback(async (answer: string | string[]) => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) return;

      setAnswersByQuestionId((prev) => ({
        ...prev,
        [currentQuestion.id]: answer,
      }));
      setIsSavingAnswer(true);

      await fetch('/api/round1/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          questionId: currentQuestion.id,
          answer,
          timeTaken: 0,
        }),
      });
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to save answer');
    } finally {
      setIsSavingAnswer(false);
    }
  }, [currentQuestionIndex, questions, participantId]);

  const handlePreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

  const handleFinalSubmit = useCallback(async () => {
    await submitRound();
    setSubmitDialogOpen(false);
    router.push("/");
  }, [submitRound, router]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onVisibility = () => {
      if (document.hidden) {
        fetch(`/api/participants/${participantId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "log_violation",
            violationType: "tab_switch",
            details: "Participant switched tab during Round 1",
            severity: "critical",
          }),
        });
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [participantId]);

  useEffect(() => {
    // Best-effort source tracking when user lands back from external search/LLM pages.
    if (!document.referrer) return;
    try {
      const ref = new URL(document.referrer);
      const host = ref.hostname.toLowerCase();
      const isGoogle = host.includes("google.");
      const isChatGPT = host.includes("chatgpt.com") || host.includes("openai.com");
      if (!isGoogle && !isChatGPT) return;

      const query = ref.searchParams.get("q") || ref.searchParams.get("query") || "";
      fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "log_violation",
          violationType: isGoogle ? "external_search" : "external_ai_tool",
          appName: isGoogle ? "Google" : "ChatGPT",
          severity: "critical",
          details: query
            ? `Opened from ${isGoogle ? "Google" : "ChatGPT"} with query: ${query}`
            : `Opened from ${isGoogle ? "Google" : "ChatGPT"}`,
        }),
      });
    } catch {
      // no-op
    }
  }, [participantId]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Loading Round 1 Quiz</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (quizState === 'completed' && result) {
    const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

    return (
      <main className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Round 1 - Results</h1>
          </div>

          <Round1Results result={result} maxScore={totalScore} />
        </div>
      </main>
    );
  }

  if (quizState === 'started' && questions.length > 0 && currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <main className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Round 1 - IoT Challenge
            </h1>
            <div className="flex items-center gap-3">
              <div className="font-mono text-lg font-semibold">{formatTime(remainingSeconds)}</div>
              <Button
                variant="destructive"
                onClick={() => setSubmitDialogOpen(true)}
                disabled={isFinalizing}
              >
                {isFinalizing ? "Submitting..." : "Final Submit"}
              </Button>
            </div>
          </div>

          <Round1Question
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            currentAnswer={answersByQuestionId[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
            onPrevious={currentQuestionIndex > 0 ? handlePreviousQuestion : undefined}
            onNext={currentQuestionIndex < questions.length - 1 ? handleNextQuestion : undefined}
            isSaving={isSavingAnswer}
          />
        </div>
        <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Round 1?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to finish Round 1. You cannot edit answers after submission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleFinalSubmit}>
                Yes, Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    );
  }

  return null;
}

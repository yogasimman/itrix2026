"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Gauge, Layers3, Lightbulb, Wrench } from "lucide-react";

interface Round2HintSummary {
  baseScore: number;
  maxPenalty: number;
  totalPenalty: number;
  finalScore: number;
  hintsUsedCount: number;
  totalComponents: number;
}

interface ScenarioDisplayProps {
  title: string;
  situation: string;
  whatToBuild: string;
  hintSummary: Round2HintSummary | null;
  teamNumber?: number;
}

export function ScenarioDisplay({
  title,
  situation,
  whatToBuild,
  hintSummary,
  teamNumber,
}: ScenarioDisplayProps) {
  const buildSteps = whatToBuild
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.trim());

  return (
    <div className="space-y-6">
      {hintSummary && (
        <Card className="border-cyan-200/20 bg-slate-950/60 backdrop-blur-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-cyan-50">Round 2 Component Access Scoring</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-cyan-200/20 bg-slate-900/60 p-3">
              <p className="text-xs text-cyan-100/70">Base Score</p>
              <p className="text-xl font-semibold text-cyan-50">{hintSummary.baseScore}</p>
            </div>
            <div className="rounded-lg border border-cyan-200/20 bg-slate-900/60 p-3">
              <p className="text-xs text-cyan-100/70">Penalty Used</p>
              <p className="text-xl font-semibold text-rose-300">-{hintSummary.totalPenalty}</p>
            </div>
            <div className="rounded-lg border border-cyan-200/20 bg-slate-900/60 p-3">
              <p className="text-xs text-cyan-100/70">Current Score</p>
              <p className="text-xl font-semibold text-emerald-300">{hintSummary.finalScore}</p>
            </div>
            <div className="rounded-lg border border-cyan-200/20 bg-slate-900/60 p-3">
              <p className="text-xs text-cyan-100/70">Components Accessed</p>
              <p className="text-xl font-semibold text-cyan-50">
                {hintSummary.hintsUsedCount}/{hintSummary.totalComponents}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-cyan-200/20 bg-slate-950/60 backdrop-blur-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10">
                <Lightbulb className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <CardTitle className="text-xl text-cyan-50">{title}</CardTitle>
                {teamNumber && (
                  <Badge variant="outline" className="mt-1 border-cyan-200/30 text-cyan-100">
                    Team {teamNumber}
                  </Badge>
                )}
              </div>
            </div>
            <Badge variant="outline" className="hidden items-center gap-1 border-cyan-200/30 text-cyan-100 md:inline-flex">
              <Gauge className="h-3.5 w-3.5" />
              Live Scenario
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-cyan-200/15 bg-slate-900/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-medium text-cyan-100">The Situation</span>
            </div>
            <p className="text-sm leading-relaxed text-cyan-50/95">{situation}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cyan-200/20 bg-slate-950/60 backdrop-blur-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10">
              <Wrench className="h-5 w-5 text-cyan-200" />
            </div>
            <CardTitle className="text-lg text-cyan-50">What to Build</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {buildSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg border border-cyan-200/15 bg-slate-900/45 p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/15 text-xs font-medium text-cyan-100">
                  {index + 1}
                </div>
                <p className="flex-1 pt-0.5 text-sm leading-relaxed text-cyan-50/95">
                  {step.replace(/^\d+\.\s*/, "")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-cyan-200/20 bg-slate-900/60 px-3 py-2 text-xs text-cyan-100/80">
            <Layers3 className="h-3.5 w-3.5" />
            Work from top to bottom to keep implementation stable.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trophy, Users, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LeaderboardEntry {
  rank: number;
  team_name: string;
  team_lead: string;
  member_names: string[];
  avg_score: number;
  members: number;
  completed_members: number;
}

interface Round2WinnerEntry {
  rank: number;
  team_name: string;
}

interface Round2PlacementStyle {
  label: string;
  containerClass: string;
  overlayClass: string;
  badgeClass: string;
  rankClass: string;
  titleClass: string;
  subtitleClass: string;
}

const ROUND2_WINNERS: Round2WinnerEntry[] = [
  { rank: 1, team_name: "T2" },
  { rank: 2, team_name: "Shadow Sentinals" },
  { rank: 3, team_name: "T4" },
  { rank: 4, team_name: "BIOT" },
  { rank: 5, team_name: "Neural Echo" },
  { rank: 6, team_name: "T5" },
];

function getRound2Placement(rank: number): Round2PlacementStyle {
  if (rank === 1) {
    return {
      label: "Gold",
      containerClass: "border-yellow-400/80 bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-200",
      overlayClass: "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.22),transparent_50%)]",
      badgeClass: "border-yellow-500 bg-yellow-200/95 text-yellow-950",
      rankClass: "border-yellow-700/70 bg-yellow-950 text-yellow-100",
      titleClass: "text-amber-950",
      subtitleClass: "text-amber-900/80",
    };
  }
  if (rank === 2) {
    return {
      label: "Silver",
      containerClass: "border-zinc-400/80 bg-gradient-to-br from-zinc-100 via-slate-50 to-zinc-200",
      overlayClass: "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.78),transparent_44%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.18),transparent_50%)]",
      badgeClass: "border-zinc-500 bg-zinc-200/95 text-zinc-950",
      rankClass: "border-zinc-700/70 bg-zinc-900 text-zinc-100",
      titleClass: "text-zinc-950",
      subtitleClass: "text-zinc-800/80",
    };
  }
  if (rank === 3) {
    return {
      label: "Bronze",
      containerClass: "border-amber-600/80 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200",
      overlayClass: "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.76),transparent_44%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.2),transparent_50%)]",
      badgeClass: "border-amber-700 bg-amber-200/95 text-amber-950",
      rankClass: "border-amber-800/70 bg-amber-950 text-amber-100",
      titleClass: "text-amber-950",
      subtitleClass: "text-amber-900/80",
    };
  }
  return {
    label: "Qualified & Attended",
    containerClass: "border-slate-300 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200",
    overlayClass: "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_45%)]",
    badgeClass: "border-slate-400 bg-slate-200/95 text-slate-800",
    rankClass: "border-slate-500/70 bg-slate-800 text-slate-100",
    titleClass: "text-slate-900",
    subtitleClass: "text-slate-700/85",
  };
}

export default function PublicLeaderboardPage() {
  const { data, isLoading } = useSWR("/api/leaderboard", fetcher, {
    refreshInterval: 15000,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl py-16 text-center">
          <Spinner className="mx-auto h-8 w-8" />
          <p className="mt-4 text-sm text-muted-foreground">Loading leaderboard...</p>
        </div>
      </main>
    );
  }

  if (!data?.enabled) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl py-12">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Not Available</CardTitle>
              <CardDescription>
                Public leaderboard is currently disabled by the admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const rows: LeaderboardEntry[] = data?.leaderboard || [];

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Public Leaderboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Round 2 winners are listed separately. Team rankings below are based on average completed Round 1 scores.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Teams Ranked</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{rows.length}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Team Score</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{rows[0] ? rows[0].avg_score.toFixed(1) : "0.0"}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Refresh</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-medium">{new Date(data.updatedAt).toLocaleTimeString()}</CardContent>
          </Card>
        </div>

        <Card className="border-amber-200/70 bg-gradient-to-b from-background to-amber-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Round 2 Winners
            </CardTitle>
            <CardDescription>
              Official Round 2 ranking. Top 3 teams are cash-prize winners, and ranks 4-6 are teams that qualified and attended Round 2.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ROUND2_WINNERS.map((winner) => {
              const placement = getRound2Placement(winner.rank);
              const isPodium = winner.rank <= 3;

              return (
                <div
                  key={winner.team_name}
                  className={`relative overflow-hidden rounded-xl border p-4 shadow-sm transition-colors sm:p-5 ${placement.containerClass}`}
                >
                  <div className={`pointer-events-none absolute inset-0 ${placement.overlayClass}`} aria-hidden="true" />
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-2 text-sm font-semibold ${placement.rankClass}`}
                      >
                        #{winner.rank}
                      </span>
                      <div>
                        <p className={`text-base font-semibold tracking-tight ${placement.titleClass}`}>{winner.team_name}</p>
                        <p className={`text-xs font-medium ${placement.subtitleClass}`}>
                          {isPodium ? "Round 2 Winner" : "Round 2 Qualified & Attended"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={placement.badgeClass}>
                      {placement.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Round 1 Team Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No ranked teams yet.</p>
            ) : (
              rows.map((row) => (
                <div key={row.team_name} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={row.rank <= 3 ? "default" : "secondary"}>#{row.rank}</Badge>
                    <div>
                      <p className="font-medium">{row.team_name}</p>
                      <p className="text-xs text-muted-foreground">Lead: {row.team_lead}</p>
                      <p className="text-xs text-muted-foreground">
                        Members: {row.member_names.length ? row.member_names.join(", ") : "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <Users className="mr-1 inline h-3 w-3" />
                        {row.members} members
                        <span className="ml-3">
                          <CheckCircle2 className="mr-1 inline h-3 w-3 text-emerald-600" />
                          {row.completed_members} completed
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold">{row.avg_score.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

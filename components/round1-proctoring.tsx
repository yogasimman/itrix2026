"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Round1ProctoringProps {
  participantId: string;
  enabled: boolean;
}

type WarningType = "fullscreen" | "tab_switch" | "window_switch";

export function Round1Proctoring({ participantId, enabled }: Round1ProctoringProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningType, setWarningType] = useState<WarningType | null>(null);
  const [violationCount, setViolationCount] = useState(0);
  const lastViolationTime = useRef<Record<string, number>>({});

  const logViolation = useCallback(
    async (type: string, details: string, severity: "warning" | "critical" = "critical") => {
      const now = Date.now();
      const lastTime = lastViolationTime.current[type] || 0;
      if (now - lastTime < 2000) return;
      lastViolationTime.current[type] = now;

      setViolationCount((prev) => prev + 1);
      try {
        await fetch(`/api/participants/${participantId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "log_violation", violationType: type, details, severity }),
        });
      } catch (e) {
        console.error("Failed to log violation:", e);
      }
    },
    [participantId]
  );

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setWarningType(null);
    } catch {
      // Fullscreen may be blocked in embedded/iframe contexts
    }
  }, []);

  // Enter fullscreen when quiz becomes active
  useEffect(() => {
    if (!enabled) return;
    const timeout = setTimeout(() => {
      enterFullscreen();
    }, 500);
    return () => clearTimeout(timeout);
  }, [enabled, enterFullscreen]);

  // Fullscreen change — detect exit
  useEffect(() => {
    if (!enabled) return;
    const handleFSChange = () => {
      const inFS = !!document.fullscreenElement;
      setIsFullscreen(inFS);
      if (!inFS) {
        setWarningType("fullscreen");
        logViolation(
          "fullscreen_exit",
          "Participant exited fullscreen mode during Round 1.",
          "critical"
        );
      }
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, [enabled, logViolation]);

  // Tab switch — visibilitychange
  useEffect(() => {
    if (!enabled) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setWarningType("tab_switch");
        logViolation(
          "tab_switch",
          "Participant switched to another browser tab during Round 1.",
          "critical"
        );
      } else {
        // Tab is visible again — clear tab_switch warning, but keep fullscreen warning if still out
        setWarningType((prev) => {
          if (prev === "tab_switch") {
            return !!document.fullscreenElement ? null : "fullscreen";
          }
          return prev;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled, logViolation]);

  // Window blur — Alt+Tab or switching to another app
  useEffect(() => {
    if (!enabled) return;
    const handleBlur = () => {
      setWarningType("window_switch");
      logViolation(
        "window_switch",
        "Participant switched away from the quiz window (Alt+Tab or external app).",
        "critical"
      );
    };
    const handleFocus = () => {
      // Window is focused again — clear window_switch warning, keep fullscreen warning if needed
      setWarningType((prev) => {
        if (prev === "window_switch") {
          return !!document.fullscreenElement ? null : "fullscreen";
        }
        return prev;
      });
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [enabled, logViolation]);

  // Disable copy, cut, paste, and right-click
  useEffect(() => {
    if (!enabled) return;
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
    };
  }, [enabled]);

  // Keyboard shortcut blocking: Ctrl/Cmd+C/X/A/V, Ctrl/Cmd+T/N/W
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // Block copy / cut / select-all
      if (ctrl && ["c", "x", "a"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        if (e.key.toLowerCase() !== "a") {
          logViolation(
            "copy_attempt",
            `Participant attempted to ${e.key.toLowerCase() === "c" ? "copy" : "cut"} content (${e.ctrlKey ? "Ctrl" : "Cmd"}+${e.key.toUpperCase()}).`,
            "warning"
          );
        }
        return;
      }

      // Block new tab / new window / close tab
      if (ctrl && ["t", "n", "w"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        logViolation(
          "browser_shortcut",
          `Participant attempted browser shortcut: ${e.ctrlKey ? "Ctrl" : "Cmd"}+${e.key.toUpperCase()}.`,
          "critical"
        );
        return;
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [enabled, logViolation]);

  if (!enabled) return null;

  // Initial fullscreen entry prompt
  if (!isFullscreen && warningType === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-primary/10">
            <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Fullscreen Required</h1>
            <p className="text-muted-foreground text-sm">
              Round 1 must be taken in fullscreen mode. Click below to begin your exam.
            </p>
          </div>
          <button
            onClick={enterFullscreen}
            className="w-full bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Enter Fullscreen &amp; Begin
          </button>
        </div>
      </div>
    );
  }

  // Violation warning overlays
  if (warningType !== null) {
    const messages: Record<WarningType, { title: string; body: string; action: string }> = {
      fullscreen: {
        title: "FULLSCREEN VIOLATION",
        body: "You have exited fullscreen mode. This is not permitted during Round 1.",
        action: "Return to Fullscreen",
      },
      tab_switch: {
        title: "TAB SWITCH DETECTED",
        body: "You switched to another browser tab. This is not permitted during Round 1.",
        action: "Return to Exam",
      },
      window_switch: {
        title: "WINDOW SWITCH DETECTED",
        body: "You switched away from the exam window (Alt+Tab). This is not permitted during Round 1.",
        action: "Return to Exam",
      },
    };

    const msg = messages[warningType];
    const needsFullscreen = warningType === "fullscreen" || !document.fullscreenElement;

    return (
      <div className="fixed inset-0 z-[9999] bg-red-600/95 flex flex-col items-center justify-center p-8 text-white text-center">
        <div className="max-w-lg space-y-6">
          <div className="text-7xl">⚠️</div>
          <div>
            <h1 className="text-3xl font-bold mb-3">{msg.title}</h1>
            <p className="text-lg opacity-90 mb-2">{msg.body}</p>
            <p className="text-sm opacity-80">
              This incident has been recorded and sent to the invigilator.
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
            <span className="text-sm font-medium">
              Violations recorded this session: {violationCount}
            </span>
          </div>
          <button
            onClick={needsFullscreen ? enterFullscreen : () => setWarningType(null)}
            className="w-full bg-white text-red-600 font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/90 transition-colors"
          >
            {needsFullscreen ? "Return to Fullscreen" : msg.action}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

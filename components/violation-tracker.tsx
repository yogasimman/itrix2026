"use client";

import { useEffect, useCallback, useRef, useState } from "react";

interface ViolationTrackerProps {
  participantId: string;
  enabled: boolean;
  onViolation: (type: string, details: string, severity?: string) => void;
  mode?: "round1" | "round2";
}

export function ViolationTracker({
  participantId,
  enabled,
  onViolation,
  mode = "round2",
}: ViolationTrackerProps) {
  const lastViolationTime = useRef<Record<string, number>>({});
  const [showWarningBanner, setShowWarningBanner] = useState(false);

  const logViolation = useCallback(
    async (
      type: string,
      details: string,
      severity: "permitted" | "warning" | "critical" = "warning"
    ) => {
      const now = Date.now();
      const lastTime = lastViolationTime.current[type] || 0;
      if (now - lastTime < 3000) return;
      lastViolationTime.current[type] = now;

      try {
        await fetch(`/api/participants/${participantId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "log_violation",
            violationType: type,
            details,
            severity,
          }),
        });
        onViolation(type, details, severity);
      } catch (error) {
        console.error("Failed to log violation:", error);
      }
    },
    [participantId, onViolation]
  );

  useEffect(() => {
    if (!enabled) return;

    const isRound2 = mode === "round2";

    // Tab switch — always a violation for Round 2 (should only use this site + local Arduino IDE, not other browser tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation(
          "tab_switch",
          "Participant switched to another browser tab. Only this site and locally installed Arduino IDE are permitted.",
          "critical"
        );
        if (isRound2) setShowWarningBanner(true);
      } else {
        // They came back — keep the banner visible so they see it
      }
    };

    // Window blur — switching to another application
    // For Round 2: Arduino IDE is allowed, anything else is a violation.
    // We cannot detect which app was used from the browser, so this is logged as a warning
    // and the invigilator can correlate with context.
    const handleBlur = () => {
      if (isRound2) {
        logViolation(
          "window_blur",
          "Participant switched away from browser. Only this site and locally installed Arduino IDE are permitted — any other application is a violation.",
          "warning"
        );
        setShowWarningBanner(true);
      }
    };

    // Keyboard shortcuts — block new tabs/windows
    const handleKeyDown = (e: KeyboardEvent) => {
      const isBrowserShortcut =
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "t" ||
          e.key.toLowerCase() === "n" ||
          e.key.toLowerCase() === "w");
      if (isBrowserShortcut) {
        e.preventDefault();
        logViolation(
          "browser_shortcut",
          `Participant used browser shortcut (${e.ctrlKey ? "Ctrl" : "Cmd"}+${e.key.toUpperCase()}) — not permitted.`,
          "critical"
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, logViolation, mode]);

  // Warning banner shown when participant switches away (Round 2)
  if (!enabled || mode !== "round2") return null;

  if (showWarningBanner) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="font-semibold text-sm">
            VIOLATION RECORDED — You switched away from this page.{" "}
            <span className="font-normal opacity-90">
              Only this competition site and your locally installed Arduino IDE are permitted. All other applications are a violation.
            </span>
          </span>
        </div>
        <button
          onClick={() => setShowWarningBanner(false)}
          className="text-destructive-foreground/70 hover:text-destructive-foreground text-xs underline shrink-0 ml-4"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return null;
}

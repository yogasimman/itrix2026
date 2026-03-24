"use client";

import { useEffect, useCallback, useRef } from "react";

// Whitelisted applications that are allowed during the competition
const WHITELISTED_APPS = [
  "Arduino IDE",
  "Visual Studio Code", 
  "Code",
  "Notepad++",
  "Code::Blocks",
  "PlatformIO",
  "Thonny",
  "IDLE",
];

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
  mode = "round1",
}: ViolationTrackerProps) {
  const lastViolationTime = useRef<number>(0);
  const lastViolationType = useRef<string>("");

  const logViolation = useCallback(
    async (
      type: string, 
      details: string, 
      severity: "permitted" | "warning" | "critical" = "warning"
    ) => {
      // Debounce violations (min 2 seconds apart for same type)
      const now = Date.now();
      if (now - lastViolationTime.current < 2000 && lastViolationType.current === type) return;
      lastViolationTime.current = now;
      lastViolationType.current = type;

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

    const isRound1 = mode === "round1";

    // Tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Round 1: strict anti-tab-switch
        // Round 2: participant may switch to Arduino IDE (allowed), so record as permitted trace only
        if (isRound1) {
          logViolation(
            "tab_switch", 
            "User switched to another browser tab", 
            "critical"
          );
        } else {
          logViolation(
            "focus_change",
            "User focus left browser window (Round 2 local IDE usage expected)",
            "permitted"
          );
        }
      }
    };

    // Window blur - Check if it's a whitelisted app or suspicious
    // Note: Browser cannot detect which app gained focus, so window blur
    // is logged as a WARNING (not critical) to allow IDE usage
    const handleBlur = () => {
      if (isRound1) {
        logViolation(
          "window_blur", 
          "User focus left browser window (may be using local IDE)", 
          "warning"
        );
      } else {
        logViolation(
          "window_blur",
          "User switched away from browser (Round 2 allows local IDE workflow)",
          "permitted"
        );
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isRound1) {
        logViolation(
          "fullscreen_exit", 
          "User exited fullscreen mode", 
          "warning"
        );
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect suspicious key combinations - CRITICAL
      if (e.altKey && e.key === "Tab" && isRound1) {
        logViolation(
          "alt_tab", 
          "User pressed Alt+Tab to switch windows", 
          "critical"
        );
      }
      // Ctrl/Cmd + T/N/W opens/manages browser tabs/windows (not required for IDE workflow)
      const isBrowserShortcut =
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "t" || e.key.toLowerCase() === "n" || e.key.toLowerCase() === "w");
      if (isBrowserShortcut) {
        e.preventDefault();
        logViolation(
          "browser_shortcut", 
          `User pressed browser navigation shortcut (${e.ctrlKey ? "Ctrl" : "Cmd"}+${e.key.toUpperCase()})`,
          "critical"
        );
      }
      // Ctrl+C, Ctrl+V in certain contexts could be suspicious
      // But we allow them for code editing - don't log
    };

    // Right-click context menu - WARNING
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click but log it as a warning
      logViolation(
        "context_menu",
        "User opened context menu",
        "warning"
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);
    // Optionally track context menu - uncomment if needed
    // document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
      // document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled, logViolation, mode]);

  return null;
}

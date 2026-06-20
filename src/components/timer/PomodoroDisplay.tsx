"use client";

import { useEffect, useRef, useState } from "react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { formatTime } from "@/lib/utils";

export function PomodoroDisplay() {
  const {
    currentPhase,
    isRunning,
    studyDuration,
    restDuration,
    getRemainingSeconds,
    advancePhase,
  } = useWorkspaceStore();

  const [remaining, setRemaining] = useState(() => getRemainingSeconds());
  const rafRef = useRef<number | null>(null);
  const advancedRef = useRef(false);

  useEffect(() => {
    advancedRef.current = false;

    const tick = () => {
      const r = getRemainingSeconds();
      setRemaining(r);

      if (r <= 0 && !advancedRef.current) {
        advancedRef.current = true;
        setTimeout(() => {
          advancePhase();
          advancedRef.current = false;
        }, 600);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, currentPhase, studyDuration, restDuration, getRemainingSeconds, advancePhase]);

  const phaseDuration = currentPhase === "study" ? studyDuration : restDuration;
  const progress = remaining / phaseDuration;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const isStudy = currentPhase === "study";
  const arcColor = isStudy ? "hsl(25, 90%, 60%)" : "hsl(195, 80%, 55%)";

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      {/* Mini circular progress */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg
          className="absolute inset-0 -rotate-90"
          width="64"
          height="64"
          viewBox="0 0 64 64"
        >
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="5"
          />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.6s ease" }}
          />
        </svg>
        <span
          className="text-xs font-bold tabular-nums z-10"
          style={{ color: arcColor, fontSize: "0.6rem" }}
        >
          {isStudy ? "FOCUS" : "BREAK"}
        </span>
      </div>

      {/* Time + phase label */}
      <div className="flex flex-col">
        <span className="timer-display">{formatTime(remaining)}</span>
        <span 
          className={`phase-badge ${isStudy ? "phase-badge--study" : "phase-badge--rest"} mt-1 cursor-pointer hover:opacity-80 transition-opacity select-none`}
          onClick={advancePhase}
          title="Click to toggle phase"
        >
          {isStudy ? "🎯 Focus" : "☕ Break"}
        </span>
      </div>
    </div>
  );
}

"use client";

import { Play, Pause, RotateCcw, Settings2 } from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./SettingsDialog";
import { useState } from "react";

export function TimerControls() {
  const { isRunning, startTimer, pauseTimer, resetTimer } = useWorkspaceStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="control-btn"
          aria-label="Reset timer"
          id="timer-reset-btn"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="play-pause-btn"
          aria-label={isRunning ? "Pause timer" : "Start timer"}
          id="timer-play-pause-btn"
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 translate-x-0.5" />
          )}
        </button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          className="control-btn"
          aria-label="Timer settings"
          id="timer-settings-btn"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

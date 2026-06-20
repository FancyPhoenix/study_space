"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PomodoroDisplay } from "@/components/timer/PomodoroDisplay";
import { TimerControls } from "@/components/timer/TimerControls";
import { DesktopArea } from "@/components/workspace/DesktopArea";
import { TabDock } from "@/components/workspace/TabDock";
import { AddWindowDialog } from "@/components/workspace/AddWindowDialog";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

export default function Home() {
  const [addOpen, setAddOpen] = useState(false);
  const { windows, clearWindows } = useWorkspaceStore();

  return (
    <main className="app-root">
      {/* Header / Timer Panel */}
      <header className="timer-panel">
        <div className="timer-panel-inner">
          {/* Brand */}
          <div className="brand">
            <span className="brand-name">Study Space</span>
          </div>

          {/* Timer */}
          <PomodoroDisplay />

          {/* Controls row */}
          <TimerControls />

          {/* Action buttons */}
          <div className="header-actions">
            {windows.length > 0 && (
              <Button
                onClick={clearWindows}
                variant="outline"
                className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-400/10"
                id="header-clear-windows-btn"
                title="Close all windows"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button
              onClick={() => setAddOpen(true)}
              className="btn-primary"
              id="header-add-window-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Window
            </Button>
            <TabDock />
          </div>
        </div>
      </header>

      {/* Desktop workspace */}
      <DesktopArea />

      <AddWindowDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </main>
  );
}

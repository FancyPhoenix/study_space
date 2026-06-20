"use client";

import { useState } from "react";
import { Layers, Eye, EyeOff, X, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { AddWindowDialog } from "./AddWindowDialog";

export function TabDock() {
  const { windows, currentPhase, removeWindow, setManuallyVisible } =
    useWorkspaceStore();
  const [addOpen, setAddOpen] = useState(false);

  const getIsVisible = (win: (typeof windows)[number]) =>
    win.manuallyVisible === true ||
    win.category === "both" ||
    (win.category === "study" && currentPhase === "study") ||
    (win.category === "entertainment" && currentPhase === "rest");

  const categoryColors: Record<string, string> = {
    study: "hsl(25, 90%, 58%)",
    entertainment: "hsl(195, 80%, 55%)",
    both: "hsl(260, 70%, 65%)",
  };

  const categoryEmoji: Record<string, string> = {
    study: "🎯",
    entertainment: "🎬",
    both: "👁",
  };

  return (
    <>
      <Sheet>
        <SheetTrigger
          className="dock-btn inline-flex items-center justify-center rounded-md text-sm font-medium border px-3 h-9"
          id="tab-dock-btn"
          aria-label="Open tab dock"
        >
          <Layers className="w-4 h-4 mr-2" />
          Windows{" "}
          <span className="dock-count">{windows.length}</span>
        </SheetTrigger>

        <SheetContent side="right" className="dock-sheet">
          <SheetHeader>
            <SheetTitle className="dock-sheet-title">
              <Layers className="w-5 h-5 inline mr-2 text-orange-400" />
              Window Manager
            </SheetTitle>
          </SheetHeader>

          <div className="dock-list">
            {windows.length === 0 && (
              <p className="text-white/40 text-sm text-center mt-8">
                No windows yet. Add one below!
              </p>
            )}

            {windows.map((win) => {
              const visible = getIsVisible(win);
              const accentColor = categoryColors[win.category];

              return (
                <div key={win.id} className="dock-item">
                  <div
                    className="dock-item-accent"
                    style={{ background: accentColor }}
                  />
                  <div className="dock-item-info">
                    <span className="dock-item-title">
                      {categoryEmoji[win.category]} {win.title}
                    </span>
                    <span
                      className="dock-item-cat"
                      style={{ color: accentColor }}
                    >
                      {win.category}
                    </span>
                  </div>
                  <div className="dock-item-actions">
                    <button
                      onClick={() =>
                        setManuallyVisible(win.id, !win.manuallyVisible)
                      }
                      className="dock-action-btn"
                      title={
                        win.manuallyVisible
                          ? "Remove override"
                          : visible
                          ? "Force hide"
                          : "Force show"
                      }
                    >
                      {visible ? (
                        <Eye className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </button>
                    <button
                      onClick={() => removeWindow(win.id)}
                      className="dock-action-btn"
                      title="Close window"
                    >
                      <X className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dock-footer">
            <Button
              onClick={() => setAddOpen(true)}
              className="btn-primary w-full"
              id="dock-add-window-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Window
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AddWindowDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}

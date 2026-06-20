"use client";

import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { AppWindow } from "./AppWindow";

export function DesktopArea() {
  const { windows, currentPhase } = useWorkspaceStore();

  return (
    <div className="desktop-area" id="desktop-area">
      {windows.map((win) => {
        const isVisible =
          win.manuallyVisible === true ||
          win.category === "both" ||
          (win.category === "study" && currentPhase === "study") ||
          (win.category === "entertainment" && currentPhase === "rest");

        return (
          <AppWindow key={win.id} window={win} isVisible={isVisible} />
        );
      })}
    </div>
  );
}

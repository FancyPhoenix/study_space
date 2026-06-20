"use client";

import { Rnd } from "react-rnd";
import { X, GripHorizontal } from "lucide-react";
import { useWorkspaceStore, WindowData } from "@/store/useWorkspaceStore";
import { IframeContent } from "./apps/IframeContent";

interface AppWindowProps {
  window: WindowData;
  isVisible: boolean;
}

export function AppWindow({ window: win, isVisible }: AppWindowProps) {
  const { updateWindow, removeWindow, bringToFront } = useWorkspaceStore();

  const handleDragStop = (_e: unknown, d: { x: number; y: number }) => {
    updateWindow(win.id, { x: d.x, y: d.y });
  };

  const handleResizeStop = (
    _e: unknown,
    _dir: unknown,
    ref: HTMLElement,
    _delta: unknown,
    position: { x: number; y: number }
  ) => {
    updateWindow(win.id, {
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
      x: position.x,
      y: position.y,
    });
  };

  const categoryColors: Record<string, string> = {
    study: "hsl(25, 90%, 58%)",
    entertainment: "hsl(195, 80%, 55%)",
    both: "hsl(260, 70%, 65%)",
  };

  const accentColor = categoryColors[win.category] ?? categoryColors.both;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: isVisible ? "auto" : "none",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 300ms ease",
        zIndex: win.zIndex,
      }}
    >
      <Rnd
        default={{
          x: win.x,
          y: win.y,
          width: win.width,
          height: win.height,
        }}
        position={{ x: win.x, y: win.y }}
        size={{ width: win.width, height: win.height }}
        minWidth={340}
        minHeight={240}
        bounds="parent"
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onMouseDown={() => bringToFront(win.id)}
        dragHandleClassName="drag-handle"
        style={{ zIndex: win.zIndex }}
      >
        {/* Window chrome */}
        <div className="iframe-window">
          {/* Title bar */}
          <div
            className="drag-handle iframe-titlebar"
            style={{ borderTop: `2px solid ${accentColor}` }}
          >
            <GripHorizontal className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <span className="iframe-title">{win.title}</span>
            <div className="flex items-center gap-1 shrink-0">
              <span
                className="iframe-category-badge"
                style={{ background: accentColor + "33", color: accentColor }}
              >
                {win.category}
              </span>
              <button
                onClick={() => removeWindow(win.id)}
                className="iframe-close-btn"
                aria-label="Close window"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* App content */}
          <div className="iframe-body">
            <IframeContent window={win} />
          </div>
        </div>
      </Rnd>
    </div>
  );
}

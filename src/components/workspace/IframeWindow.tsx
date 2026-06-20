"use client";

import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { X, Minimize2, AlertTriangle, GripHorizontal } from "lucide-react";
import { useWorkspaceStore, WindowData } from "@/store/useWorkspaceStore";

interface IframeWindowProps {
  window: WindowData;
  isVisible: boolean;
}

export function IframeWindow({ window: win, isVisible }: IframeWindowProps) {
  const { updateWindow, removeWindow, bringToFront } = useWorkspaceStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState(false);

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

          {/* Iframe content */}
          <div className="iframe-body">
            {iframeError ? (
              <div className="iframe-error">
                <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
                <p className="text-sm font-medium text-white/80 text-center max-w-xs">
                  This website cannot be embedded because it blocks iframe
                  access through browser security policies.
                </p>
                <a
                  href={win.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="iframe-open-link"
                >
                  Open in new tab →
                </a>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={win.url}
                title={win.title}
                className="w-full h-full border-0"
                onError={() => setIframeError(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                allow="autoplay; fullscreen"
              />
            )}
          </div>
        </div>
      </Rnd>
    </div>
  );
}

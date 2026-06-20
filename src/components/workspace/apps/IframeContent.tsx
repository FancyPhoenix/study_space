"use client";

import { useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { WindowData } from "@/store/useWorkspaceStore";

export function IframeContent({ window: win }: { window: WindowData }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState(false);

  if (iframeError || !win.url) {
    return (
      <div className="iframe-error">
        <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
        <p className="text-sm font-medium text-white/80 text-center max-w-xs">
          This website cannot be embedded because it blocks iframe
          access through browser security policies.
        </p>
        {win.url && (
          <a
            href={win.url}
            target="_blank"
            rel="noopener noreferrer"
            className="iframe-open-link"
          >
            Open in new tab →
          </a>
        )}
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={win.url}
      title={win.title}
      className="w-full h-full border-0 bg-white"
      onError={() => setIframeError(true)}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      allow="autoplay; fullscreen"
    />
  );
}

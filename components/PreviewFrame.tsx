"use client";

import { useState } from "react";

interface PreviewFrameProps {
  html: string;
}

export default function PreviewFrame({ html }: PreviewFrameProps) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex flex-col h-full">
      {/* Toggle Desktop / Mobile */}
      <div className="flex items-center gap-2 mb-4" role="tablist" aria-label="Preview mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "desktop"}
          onClick={() => setMode("desktop")}
          className={`px-4 py-2 text-[13px] font-medium rounded-full transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent-blue ${
            mode === "desktop"
              ? "bg-surface-2 text-ink"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Desktop
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "mobile"}
          onClick={() => setMode("mobile")}
          className={`px-4 py-2 text-[13px] font-medium rounded-full transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent-blue ${
            mode === "mobile"
              ? "bg-surface-2 text-ink"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Mobile
        </button>
      </div>

      {/* Iframe */}
      <div
        className={`flex-1 flex items-start justify-center overflow-auto bg-surface-1 rounded-[15px] p-4 ${
          mode === "mobile" ? "items-start" : ""
        }`}
      >
        <div
          className={`${
            mode === "mobile"
              ? "w-full max-w-[390px] border-2 border-hairline rounded-[30px] overflow-hidden mx-auto"
              : "w-full h-full"
          }`}
        >
          <iframe
            srcDoc={html}
            title="Landing Page Preview"
            className={`bg-white ${
              mode === "mobile"
                ? "w-full max-w-[390px] h-[700px]"
                : "w-full h-full min-h-[600px]"
            }`}
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}

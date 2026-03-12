import React from "react";

function Loading() {
  return (
    <main className="min-h-screen flex relative overflow-hidden bg-[var(--bg-canvas)]">
      {/* GRID LINES (FULL PAGE BACKGROUND) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Vertical lines with FASTER + BRIGHTER pipe flow */}
        <div className="absolute inset-0 flex justify-between px-12">
          {[...Array(12)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="relative w-px h-full bg-[var(--border-subtle)] overflow-hidden"
            >
              <div
                className="vs-pipe-flow-vertical-fast" // Updated class name
                style={{ animationDelay: `${i * 0.4}s` }} // Faster delays
              />
            </div>
          ))}
        </div>

        {/* Horizontal lines with FASTER + BRIGHTER pipe flow */}
        <div className="absolute inset-0 flex flex-col justify-between py-12">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="relative h-px w-full bg-[var(--border-subtle)] overflow-hidden"
            >
              <div
                className="vs-pipe-flow-horizontal-fast" // Updated class name
                style={{ animationDelay: `${i * 0.3}s` }} // Faster delays
              />
            </div>
          ))}
        </div>
      </div>

      {/* LOADING TEXT IN THE CENTER */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-[clamp(2rem,5vw,4rem)] tracking-[-0.04em] font-light text-[var(--text-primary)]">
            LOADING
          </h2>
          {/* Animated dots (optional) */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-bounce-fast" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-bounce-fast" style={{ animationDelay: "0.15s" }} />
            <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-bounce-fast" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Loading;

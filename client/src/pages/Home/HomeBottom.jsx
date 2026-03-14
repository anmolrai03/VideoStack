import { Link } from "react-router-dom";

export default function HomeBottom() {
  return (
    <div className="bg-[var(--bg-canvas)] text-[var(--text-primary)] relative">
      {/* OUTER FRAME STARTS HERE */}
      <div className="mx-4 sm:mx-6 mb-6 border border-[var(--border-subtle)] relative">
        {/* TOP BIG TITLE STARTS HERE */}
        <div className="border-b border-[var(--border-subtle)] px-4 sm:px-8 pt-10 pb-6 relative">
          {/* GRID SEQUENCY BACKGROUND WITH ANIMATIONS STARTS HERE */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* VERTICAL LINES WITH PIPE FLOW ANIMATION STARTS HERE*/}
            <div className="absolute inset-0 flex justify-between px-4 sm:px-8">
              {[...Array(5)].map((_, i) => (
                <div key={`v-${i}`} className="relative w-px h-full bg-[var(--border-subtle)]">
                  <div
                    className="vs-pipe-flow-vertical"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                </div>
              ))}
            </div>
            {/* VERTICAL LINES WITH PIPE FLOW ANIMATION ENDS HERE*/}

            {/* HORIZONTAL LINES WITH PIPE FLOW ANIMATION STARTS HERE */}
            <div className="absolute inset-0 flex flex-col justify-between py-10">
              {[...Array(3)].map((_, i) => (
                <div key={`h-${i}`} className="relative h-px w-full bg-[var(--border-subtle)]">
                  <div
                    className="vs-pipe-flow-horizontal"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                </div>
              ))}
            </div>
            {/* HORIZONTAL LINES WITH PIPE FLOW ANIMATION ENDS HERE */}
          </div>
          {/* GRID SEQUENCY BACKGROUND ENDS HERE */}

          {/* LABELS ON BORDER STARTS HERE */}
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-3 sm:gap-0 text-[10px] sm:text-[11px] tracking-widest text-[var(--text-muted)] font-medium mb-4 relative z-10">
            <span className="bg-[var(--bg-canvas)] px-3 py-1 relative sm:-ml-3">
              INFRASTRUCTURE
              <span className="hidden sm:block absolute left-0 top-1/2 w-3 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
            </span>

            <span className="bg-[var(--bg-canvas)] px-3 py-1 relative">
              CREATORS
              <span className="hidden sm:block absolute left-0 top-1/2 w-3 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
              <span className="hidden sm:block absolute right-0 top-1/2 w-3 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
            </span>

            <span className="bg-[var(--bg-canvas)] px-3 py-1 relative sm:-mr-3">
              SCALABILITY
              <span className="hidden sm:block absolute right-0 top-1/2 w-3 h-px bg-[var(--border-subtle)] -translate-y-1/2" />
            </span>
          </div>
          {/* LABELS ON BORDER ENDS HERE */}

          {/* HEADING STARTS HERE */}
          <h2 className="vs-hero-title relative z-10 text-[var(--text-primary)]">VIDEOSTACK</h2>
        </div>
        {/* TOP BIG TITLE ENDS HERE*/}

        {/* LOWER GRID STARTS HERE */}
        <div className="grid md:grid-cols-2 relative">
          {/* GRID SEQUENCE FOR LOWER SECTION WITH ANIMATIONS STARTS HERE */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Vertical grid lines with animation */}
            <div className="absolute inset-0 flex">
              {[...Array(3)].map((_, i) => (
                <div key={`col-${i}`} className="flex-1 relative border-r border-[var(--border-subtle)] last:border-r-0">
                  <div className="absolute inset-y-0 left-0 w-px bg-[var(--border-subtle)]">
                    <div
                      className="vs-pipe-flow-vertical"
                      style={{ animationDelay: `${i * 0.6}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Horizontal grid lines with animation */}
            <div className="absolute inset-0 flex flex-col">
              {[...Array(3)].map((_, i) => (
                <div key={`row-${i}`} className="flex-1 relative border-b border-[var(--border-subtle)] last:border-b-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-[var(--border-subtle)]">
                    <div
                      className="vs-pipe-flow-horizontal"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div> {/* GRID SEQUENCE FOR LOWER SECTION ENDS HERE */}

          {/* LEFT SIDE - WHERE VIDEOS MEET PERFORMANCE STARTS HERE */}
          <div className="p-6 sm:p-10 md:border-r border-[var(--border-subtle)] flex flex-col justify-center gap-8 relative z-10 bg-black/30 backdrop-blur-[2px]">
            <div className="space-y-4 text-[clamp(1.6rem,6vw,3rem)] md:text-[clamp(2.5rem,5vw,3.8rem)] font-light tracking-tight">
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-secondary)] bg-black/50 px-2 -ml-1 sm:-ml-2">
                  WHERE
                </span>
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-[var(--text-muted)] to-transparent" />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[var(--text-secondary)] bg-black/50 px-2">VIDEOS</span>
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-[var(--text-muted)] to-transparent" />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[var(--text-secondary)] bg-black/50 px-2">MEET</span>
              </div>

              <div className="pl-3 sm:pl-8 md:pl-12 text-[clamp(1.8rem,7vw,3.5rem)] md:text-[clamp(3rem,5vw,4.5rem)] font-light text-[var(--text-secondary)] relative">
                <span className="bg-black/50 px-2 inline-block">
                  PERFORMANCE.
                </span>
                <div className="hidden sm:block absolute -left-4 sm:-left-6 top-1/2 w-3 sm:w-4 h-px bg-gradient-to-r from-[var(--text-muted)] to-transparent" />
              </div>
            </div>

            {/* TAGLINE STARTS HERE */}
            <p className="text-[var(--text-muted)] text-xs tracking-wider mt-4 max-w-xs relative">
              <span className="bg-black/50 px-2 py-1 -ml-2 inline-block">
                INFRASTRUCTURE · CREATORS · SCALABILITY
              </span>
            </p>
          </div>
          {/* LEFT SIDE ENDS HERE */}

          {/* RIGHT SIDE SECTION STARTS HERE */}
          <div className="relative flex items-center justify-center p-10 sm:p-16 z-10 bg-black/30 backdrop-blur-[2px]">
            {/* Decorative cross lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-6 sm:left-8 right-6 sm:right-8 h-px bg-gradient-to-r from-transparent via-[var(--text-muted)] to-transparent" />
              <div className="absolute left-1/2 top-6 sm:top-8 bottom-6 sm:bottom-8 w-px bg-gradient-to-b from-transparent via-[var(--text-muted)] to-transparent" />
            </div>

            {/* CTA BUTTON */}
            <Link to="/contact" className="vs-btn">
              Contact Us
            </Link>
          </div>
          {/* RIGHT SIDE SECTION ENDS HERE */}
        </div>
        {/* LOWER GRID ENDS HERE */}
      </div>
      {/* OUTER FRAME ENDS HERE */}

      {/* BOTTOM BAR STARTS HERE */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between text-xs text-[var(--text-muted)] px-4 sm:px-8 pb-6 border-t border-[var(--border-subtle)] pt-4 mx-4 sm:mx-6">
        <span>© {new Date().getFullYear()} VIDEOSTACK · ALL RIGHTS RESERVED</span>
      </div>
    </div>
  );
}
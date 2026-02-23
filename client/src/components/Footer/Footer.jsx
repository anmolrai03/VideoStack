// footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black text-white relative">

      {/* OUTER FRAME */}
      <div className="mx-6 mb-6 border border-[#1a1a1a] relative">

        {/* ================= TOP BIG TITLE ================= */}
        <div className="border-b border-[#1a1a1a] px-8 pt-10 pb-6 relative">

          {/* Grid squares background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical lines */}
            <div className="absolute inset-0 flex justify-between px-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-px h-full bg-[#1a1a1a]" />
              ))}
            </div>
            {/* Horizontal lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-px w-full bg-[#1a1a1a]" />
              ))}
            </div>
          </div>

          {/* Labels sitting on borders */}
          <div className="
            flex justify-between text-[11px] tracking-widest
            text-white/80 font-medium mb-4
            relative z-10
          ">
            <span className="bg-black px-3 py-1 -ml-3 relative">
              INFRASTRUCTURE
              <span className="absolute left-0 top-1/2 w-3 h-px bg-[#1a1a1a] -translate-y-1/2" />
            </span>
            <span className="bg-black px-3 py-1 relative">
              CREATORS
              <span className="absolute left-0 top-1/2 w-3 h-px bg-[#1a1a1a] -translate-y-1/2" />
              <span className="absolute right-0 top-1/2 w-3 h-px bg-[#1a1a1a] -translate-y-1/2" />
            </span>
            <span className="bg-black px-3 py-1 -mr-3 relative">
              SCALABILITY
              <span className="absolute right-0 top-1/2 w-3 h-px bg-[#1a1a1a] -translate-y-1/2" />
            </span>
          </div>

          <h2
            className="
              text-[clamp(4rem,14vw,13rem)]
              leading-[0.85]
              tracking-[-0.05em]
              font-light
              select-none
              relative z-10
            "
          >
            VIDEOSTACK
          </h2>
        </div>

        {/* ================= LOWER GRID ================= */}
        <div className="grid md:grid-cols-2 relative">

          {/* Grid squares background for lower section */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-1 border-r border-[#1a1a1a] last:border-r-0" />
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-1 border-b border-[#1a1a1a] last:border-b-0" />
              ))}
            </div>
          </div>

          {/* LEFT SIDE - WHERE VIDEOS MEET PERFORMANCE */}
          <div className="p-10 border-r border-[#1a1a1a] flex flex-col justify-center gap-8 relative z-10 bg-black/30 backdrop-blur-[2px]">

            <div className="space-y-4 text-5xl md:text-6xl font-light tracking-tight">

              <div className="flex items-center gap-4">
                <span className="text-white/90 bg-black/50 px-2 -ml-2">WHERE</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-white/90 bg-black/50 px-2">VIDEOS</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-white/90 bg-black/50 px-2">MEET</span>
              </div>

              <div className="pl-12 text-6xl md:text-7xl font-light text-white/90 relative">
                <span className="bg-black/50 px-2 inline-block">
                  PERFORMANCE.
                </span>
                {/* Small accent line */}
                <div className="absolute -left-6 top-1/2 w-4 h-px bg-gradient-to-r from-white/40 to-transparent" />
              </div>

            </div>

            {/* Subtle tagline integrated with grid */}
            <p className="text-white/30 text-xs tracking-wider mt-4 max-w-xs relative">
              <span className="bg-black/50 px-2 py-1 -ml-2 inline-block">
                INFRASTRUCTURE · CREATORS · SCALABILITY
              </span>
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex items-center justify-center p-16 z-10 bg-black/30 backdrop-blur-[2px]">

            {/* Decorative cross lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>

            {/* CTA BUTTON */}
            <button className="vs-btn">Connect Us</button>
            {/* <button
              className="
                group relative
                flex items-center gap-6
                bg-white text-black
                px-8 py-4
                text-sm tracking-wider
                transition-all duration-300
                hover:opacity-90 hover:-translate-y-[2px]
                active:scale-95
                shadow-lg shadow-white/5
                z-20
              "
            >
              Connect Us
              <span className="
                bg-black text-white 
                px-3 py-1.5
                group-hover:bg-[#c1121f] 
                transition-colors duration-300
              ">
                →
              </span>
            </button> */}

          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="
        flex justify-between text-xs
        text-white/40 px-8 pb-6
        border-t border-[#1a1a1a] pt-4 mx-6
      ">
        <span>© 2026 VIDEOSTACK · ALL RIGHTS RESERVED</span>
        {/* <span className="tracking-[0.2em]">DESIGN SYSTEM · MONOCHROME</span> */}
      </div>

    </footer>
  );
}
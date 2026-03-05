import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white relative">
      {/* OUTER FRAME STARTS HERE */}
      <div className="mx-4 sm:mx-6 mb-6 border border-[#1a1a1a] relative">
        {/* TOP BIG TITLE STARTS HERE */}
        <div className="border-b border-[#1a1a1a] px-4 sm:px-8 pt-10 pb-6 relative">
          {/* GRID SEQUENCY BACKGROUND STARTS HERE */}
          <div className="absolute inset-0 pointer-events-none">
            {/* VERITCAL LINES STARTS HERE */}
            <div className="absolute inset-0 flex justify-between px-4 sm:px-8">
              {[...Array(5)].map((_, i) => (
                <div key={i + 234} className="w-px h-full bg-[#1a1a1a]" />
              ))}
            </div>
            {/* VERITCAL LINES ENDS HERE */}

            {/* HORIZONTAL LINES STARTS HERE */}
            <div className="absolute inset-0 flex flex-col justify-between py-10">
              {[...Array(3)].map((_, i) => (
                <div key={i + 234} className="h-px w-full bg-[#1a1a1a]" />
              ))}
            </div>
            {/* HORIZONTAL LINES ENDS HERE */}
          </div>
          {/* GRID SEQUENCY BACKGROUND ENDS HERE */}

          {/*LABELS ON BORDER STARTS HERE*/}
          <div
            className="
              flex flex-wrap justify-center sm:justify-between items-center
              gap-3 sm:gap-0
              text-[10px] sm:text-[11px]
              tracking-widest
              text-white/80 font-medium mb-4
              relative z-10
            "
          >
            <span className="bg-black px-3 py-1 relative sm:-ml-3">
              INFRASTRUCTURE
              <span className="hidden sm:block absolute left-0 top-1/2 w-3 h-px bg-[#1a1a1a] -translate-y-1/2" />
            </span>

            <span className="bg-black px-3 py-1 relative">
              CREATORS
              <span className="hidden sm:block absolute left-0 top-1/2 w-3 h-px bg-[#1a1a1a] -translate-y-1/2" />
              <span className="hidden sm:block absolute right-0 top-1/2 w-3 h-px bg-[#1a1a1a] -translate-y-1/2" />
            </span>

            <span className="bg-black px-3 py-1 relative sm:-mr-3">
              SCALABILITY
              <span className="hidden sm:block absolute right-0 top-1/2 w-3 h-px bg-[#1a1a1a] -translate-y-1/2" />
            </span>
          </div>
          {/* LABELS ON BORDER ENDS HERE */}

          {/* HEADING STARTS HERE */}
          <h2 className="vs-hero-title relative z-10">VIDEOSTACK</h2>
          {/* HEADING ENDS HERE */}
        </div>
        {/* TOP BIG TITLE ENDS HERE*/}

        {/* LOWER GRID STARTS HERE */}
        <div className="grid md:grid-cols-2 relative">
          {/* GRID SEQUENCE FOR LOWER SECTION STARTS HERE */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-[#1a1a1a] last:border-r-0"
                />
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-b border-[#1a1a1a] last:border-b-0"
                />
              ))}
            </div>
          </div>
          {/* GRID SEQUENCE FOR LOWER SECTION ENDS HERE */}

          {/* LEFT SIDE - WHERE VIDEOS MEET PERFORMANCE  STARTS HERE*/}
          <div className="p-6 sm:p-10 md:border-r border-[#1a1a1a] flex flex-col justify-center gap-8 relative z-10 bg-black/30 backdrop-blur-[2px]">

            <div
              className="space-y-4 
                text-[clamp(1.6rem,6vw,3rem)] 
                md:text-[clamp(2.5rem,5vw,3.8rem)] 
                font-light tracking-tight
              "
            >
              <div className="flex items-center gap-3">
                <span className="text-white/90 bg-black/50 px-2 -ml-1 sm:-ml-2">
                  WHERE
                </span>
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/90 bg-black/50 px-2">VIDEOS</span>
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/90 bg-black/50 px-2">MEET</span>
              </div>

              <div
                className="pl-3 sm:pl-8 md:pl-12
    text-[clamp(1.8rem,7vw,3.5rem)]
    md:text-[clamp(3rem,5vw,4.5rem)]
    font-light text-white/90 relative"
              >
                <span className="bg-black/50 px-2 inline-block">
                  PERFORMANCE.
                </span>

                <div
                  className="hidden sm:block absolute -left-4 sm:-left-6 top-1/2
      w-3 sm:w-4 h-px
      bg-gradient-to-r from-white/40 to-transparent"
                />
              </div>
            </div>

            {/*TAGLINE STARTS HERE*/}
            <p className="text-white/30 text-xs tracking-wider mt-4 max-w-xs relative">
              <span className="bg-black/50 px-2 py-1 -ml-2 inline-block">
                INFRASTRUCTURE · CREATORS · SCALABILITY
              </span>
            </p>
            {/* TAGLINE ENDS HERE */}

          </div>
          {/* LEFT SIDE - WHERE VIDEOS MEET PERFORMANCE  ENDS HERE*/}

          {/* RIGHT SIDE SECTION STARTS HERE*/}
          <div className="relative flex items-center justify-center p-10 sm:p-16 z-10 bg-black/30 backdrop-blur-[2px]">
            {/* Decorative cross lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-6 sm:left-8 right-6 sm:right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute left-1/2 top-6 sm:top-8 bottom-6 sm:bottom-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>

            {/* CTA BUTTON */}
            <Link to="/contact" className="vs-btn">
              Contact Us
            </Link>
            {/* <button className="vs-btn">Connect Us</button> */}
          </div>
          {/* RIGHT SIDE SECTION ENDS HERE*/}
        </div>
        {/* LOWER GRID ENDS HERE */}
      </div>
      {/* OUTER FRAME ENDS HERE */}

      {/* BOTTOM BAR STARTS HERE*/}
      <div
        className="
        flex flex-col sm:flex-row gap-2 sm:gap-0
        sm:justify-between text-xs
        text-white/40 px-4 sm:px-8 pb-6
        border-t border-[#1a1a1a] pt-4 mx-4 sm:mx-6
      "
      >
        <span>© 2026 VIDEOSTACK · ALL RIGHTS RESERVED</span>
      </div>
      {/* BOTTON BAR ENDS HERE */}

    </footer>
  );
}

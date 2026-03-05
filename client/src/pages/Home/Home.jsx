function Home() {
  return (
    <div className="bg-background min-h-screen text-white">
      <section className="vs-hero">
        {/* Replace later with your image */}
        <div
          className="vs-hero-bg"
          style={{
            backgroundImage: "url('/hero-placeholder.png')",
          }}
        />

        <div className="vs-hero-overlay" />

        {/* frame border like reference */}
        <div className="vs-frame" />

        <div className="vs-hero-content">
          {/* BIG BRAND TEXT */}
          <h1
            className="text-[clamp(2rem,10vw,13rem)] leading-[0.9] tracking-[-0.04em] font-light select-none relative z-10 wrap-break-word"
          >
            VIDEOSTACK
          </h1>

          {/* description */}
          <div className="max-w-xl mt-10 space-y-6">
            <p className="text-neutral-300 text-base leading-relaxed">
              A modern video processing platform built for creators, developers
              and teams. Upload, process and stream videos seamlessly with
              scalable infrastructure.
            </p>

            <button className="vs-btn">Start Upload →</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

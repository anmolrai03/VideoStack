import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom"; // Correct import for Link
import ActionButton from "../../components/ActionButton/ActionButton";
import HomeBottom from "./HomeBottom";

function Home() {
  return (
    <>
      <div className="bg-[var(--bg-canvas)] min-h-screen text-[var(--text-primary)]">
        <section className="vs-hero">
          {/* Hero background image */}
          <div
            className="vs-hero-bg"
            style={{
              backgroundImage: "url('/hero-placeholder.png')",
            }}
          />

          {/* Dark overlay */}
          <div className="vs-hero-overlay" />

          {/* Frame border */}
          <div className="vs-frame" />

          {/* Hero content */}
          <div className="vs-hero-content">
            {/* Brand text */}
            <h1 className="text-[clamp(2rem,10vw,13rem)] leading-[0.9] tracking-[-0.04em] font-light select-none break-words relative z-10">
              VIDEOSTACK
            </h1>

            {/* Description */}
            <div className="max-w-xl mt-10 space-y-6">
              <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                A modern video processing platform built for creators,
                developers and teams. Upload, process and stream videos
                seamlessly with scalable infrastructure.
              </p>

              {/* Use ActionButton for consistency */}
              <Link to="/upload">
                <ActionButton
                  buttonName="Start Upload"
                  icon={<ChevronRight />}
                  iconPosition="right"
                />
              </Link>
            </div>

            {/* Feed button */}
            <Link to="/feed">
              <ActionButton
                buttonName="Go to Feed"
                icon={<ChevronRight />}
                iconPosition="right"
                cssClass="mt-4" // Add margin if needed
              />
            </Link>

            <Link to="/stream">
              <ActionButton
                buttonName="Go to Stream"
                icon={<ChevronRight />}
                iconPosition="right"
                cssClass="mt-4" // Add margin if needed
              />
            </Link>
          </div>
        </section>
      </div>
      <HomeBottom />
    </>
  );
}

export default Home;

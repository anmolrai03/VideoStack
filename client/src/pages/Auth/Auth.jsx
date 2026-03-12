import { useState } from "react";
import { Link } from "react-router-dom";

import { MoveRight } from "lucide-react";

import Login from "../../components/Auth/Login";
import Signup from "../../components/Auth/Signup";
import ActionButton from "../../components/ActionButton/ActionButton";

export default function Auth() {
  const [isLoginOpen, setIsLoginOpen] = useState(true);

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      {/* GRID LINES (FULL PAGE BACKGROUND) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* vertical lines */}
        <div className="absolute inset-0 flex justify-between px-12">
          {[...Array(12)].map((_, i) => (
            <div
              key={i + 234}
              className="relative w-px h-full bg-[#1a1a1a] overflow-hidden"
            >
              <div
                className="vs-pipe-flow-vertical"
                style={{ animationDelay: `${i * 0.8}s` }}
              />
            </div>
          ))}
        </div>

        {/* horizontal lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-12">
          {[...Array(10)].map((_, i) => (
            <div
              key={i + 234}
              className="relative h-px w-full bg-[#1a1a1a] overflow-hidden"
            >
              <div
                className="vs-pipe-flow-horizontal"
                style={{ animationDelay: `${i * 0.6}s` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* LEFT (DECORATION SECTION) STARTS HERE */}
      <div className="hidden lg:flex flex-1 relative z-10 bg-panel/50">
        {/* CENTER TEXT */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-10 space-y-8">
          <h2 className="text-[clamp(3rem,6vw,6rem)] tracking-[-0.04em] font-light">
            VIDEOSTACK
          </h2>

          <p className="text-white/40 max-w-sm text-sm tracking-wide">
            Authentication portal for accessing the VideoStack infrastructure.
          </p>

          <Link to="/">
            <ActionButton
              buttonName="Go Back"
              icon={<MoveRight />}
              iconPosition="right"
            />
          </Link>
        </div>
      </div>
      {/* LEFT (DECORATION SECTION) ENDS HERE */}

      {/* RIGHT SECTION OF LOGIN/SIGNUP STARTS HERE */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 relative z-10 bg-panel/50">
        {/* MOBILE GO BACK BUTTON */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/">
            <ActionButton
              buttonName="Go Back"
              icon={<MoveRight />}
              iconPosition="right"
            />
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8 bg-[#0a0a0a]/80 p-8 rounded-2xl border border-[#1a1a1a] backdrop-blur-md">
          {/* SWITCHER */}
          <div className="flex justify-center gap-8 text-sm tracking-wide">
            <button
              onClick={() => setIsLoginOpen(true)}
              className={`pb-2 border-b transition cursor-pointer ${isLoginOpen
                ? "border-white text-white"
                : "border-transparent text-white/40 hover:text-white"
                }`}
            >
              LOGIN
            </button>

            <button
              onClick={() => setIsLoginOpen(false)}
              className={`pb-2 border-b transition cursor-pointer ${!isLoginOpen
                ? "border-white text-white"
                : "border-transparent text-white/40 hover:text-white"
                }`}
            >
              SIGN UP
            </button>
          </div>

          {/* FORM */}
          <div>{isLoginOpen ? <Login /> : <Signup />}</div>
        </div>
      </div>
      {/* RIGHT SECTION OF LOGIN/SIGNUP ENDS HERE */}

    </main>
  );
}

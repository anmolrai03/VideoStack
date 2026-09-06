import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-white flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full text-center relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-mono mb-6">
          <Compass size={14} className="text-neutral-500" />
          <span>ERROR 404</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-7xl font-light tracking-tighter text-white mb-3">
          4<span className="text-neutral-600">0</span>4
        </h1>
        <h2 className="text-xl font-normal text-neutral-200 mb-3">
          Page Not Found
        </h2>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium text-sm rounded-xl hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-black font-medium text-sm rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

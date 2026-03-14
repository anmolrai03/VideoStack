import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-navbar)] border-t border-[var(--border-subtle)] py-12 px-6 sm:px-10">
      {/* GRID LINES (SUBTLE BACKGROUND) */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Vertical lines */}
        <div className="absolute inset-0 flex justify-between px-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="w-px h-full bg-[var(--border-subtle)] opacity-50"
            />
          ))}
        </div>

        {/* Horizontal lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="h-px w-full bg-[var(--border-subtle)] opacity-50"
            />
          ))}
        </div>
      </div>

      {/* FOOTER CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top border with label */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <span className="text-[10px] tracking-[0.2em] text-[var(--text-muted)] px-4 bg-[var(--bg-navbar)]">
            VIDEOSTACK
          </span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand + Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-light tracking-[-0.04em] text-[var(--text-primary)]">
              VideoStack
            </h3>
            <p className="text-[var(--text-muted)] text-sm max-w-xs">
              A modern video processing platform for creators, developers, and teams.
            </p>
          </div>

          {/* Column 2: Quick Links (using Link) */}
          <div className="space-y-2">
            <h4 className="text-[var(--text-secondary)] font-medium text-sm tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/feed"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  Upload
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  Authenticate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources (using Link for internal docs) */}
          <div className="space-y-2">
            <h4 className="text-[var(--text-secondary)] font-medium text-sm tracking-wider">
              RESOURCES
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/docs"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  to="/tutorials"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact + Social (external links use <a>) */}
          <div className="space-y-2">
            <h4 className="text-[var(--text-secondary)] font-medium text-sm tracking-wider">
              CONTACT
            </h4>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                <a
                  href="mailto:contact@videostack.com"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  contact@videostack.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Github className="w-4 h-4 text-[var(--text-muted)]" />
                <a
                  href="https://github.com/videostack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-[var(--text-muted)]" />
                <a
                  href="https://twitter.com/videostack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[var(--text-muted)]" />
                <a
                  href="https://linkedin.com/company/videostack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom border with copyright */}
        <div className="flex items-center justify-center pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <span className="text-[10px] tracking-[0.2em] text-[var(--text-muted)] px-4 bg-[var(--bg-navbar)]">
            {new Date().getFullYear()} © VIDEOSTACK
          </span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>
      </div>
    </footer>
  );
}

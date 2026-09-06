import React from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary caught error]:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-[#0d0d0d] border border-neutral-800/80 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Warning Icon Badge */}
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-inner">
              <AlertTriangle size={28} />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-light tracking-tight text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              An unexpected render error occurred. You can reload the page or return to the home screen.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-6">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-black font-medium text-sm rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
              <a
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium text-sm rounded-xl hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Home size={16} />
                Go to Home
              </a>
            </div>

            {/* Collapsible Error Details */}
            {this.state.error && (
              <div className="text-left border-t border-neutral-800/80 pt-4">
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-xs font-mono text-neutral-500 hover:text-neutral-400 transition-colors py-1 cursor-pointer"
                >
                  <span>Technical details</span>
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 bg-black/60 border border-neutral-800 rounded-lg text-xs font-mono text-red-400/90 overflow-x-auto max-h-40 whitespace-pre-wrap select-text">
                    <p className="font-semibold text-red-300 mb-1">{this.state.error?.toString()}</p>
                    {this.state.errorInfo?.componentStack && (
                      <p className="text-neutral-500 text-[11px]">
                        {this.state.errorInfo.componentStack}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

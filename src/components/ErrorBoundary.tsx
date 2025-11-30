import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page
              or go back home.
            </p>
            <div className="flex gap-3 justify-center flex-col sm:flex-row">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-white text-amber-600 font-bold rounded-lg border-2 border-amber-600 hover:bg-amber-50 transition-all"
              >
                Go Home
              </a>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg text-left">
                <p className="text-sm font-mono text-red-700 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

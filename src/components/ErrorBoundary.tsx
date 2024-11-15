'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          <div className="text-center p-10 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 backdrop-blur-lg">
            <h2 className="text-3xl font-extrabold text-red-700 mb-6 drop-shadow-lg">
              Oops, something went wrong!
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
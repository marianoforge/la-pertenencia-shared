'use client';

import React from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Algo salió mal
      </h2>
      <p className="text-gray-700 mb-4">
        {error.message || 'Ocurrió un error inesperado'}
      </p>
      <button
        onClick={resetError}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        type="button"
      >
        Intentar de nuevo
      </button>
    </div>
  </div>
);

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by ErrorBoundary', { error, errorInfo });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}


'use client';

import { Component, ReactNode } from 'react';

interface ModelErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  modelName?: string;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  constructor(props: ModelErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ModelErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Model loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-4 text-foreground-muted"
          data-testid="model-error"
        >
          <div className="text-4xl">⚠️</div>
          <p className="text-sm">
            Failed to load{' '}
            {this.props.modelName ? `model: ${this.props.modelName}` : '3D model'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Canvas-compatible error fallback (displays within the 3D scene)
export function ErrorFallbackMesh() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff4444" wireframe />
    </mesh>
  );
}

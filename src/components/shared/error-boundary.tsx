"use client"

import { AlertCircle } from 'lucide-react'
import { Component, type ErrorInfo, type PropsWithChildren } from 'react'
import { logger } from '@/lib/logger'

interface Props extends PropsWithChildren {
  fallback?: React.ReactNode
  name?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error({
      name: this.props.name || 'ErrorBoundary',
      error,
      component: errorInfo.componentStack,
      message: error.message,
      stack: error.stack,
    })
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-8 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <h2 className="mt-4 text-xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                logger.info('Retrying after error in', this.props.name || 'ErrorBoundary')
                this.setState({ hasError: false, error: null })
              }}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
} 
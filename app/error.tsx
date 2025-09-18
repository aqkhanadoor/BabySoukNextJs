'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('App Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-playful-background">
            <Header />
            <main className="py-16 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-playful-foreground/20">
                        <h1 className="text-4xl font-bold text-playful-foreground mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6">
                            We're sorry, but something unexpected happened. Don't worry, it's not your fault!
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={reset}
                                className="bg-playful-foreground text-white py-3 px-6 rounded-lg hover:bg-playful-foreground/90 transition-colors mr-4"
                            >
                                Try again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Go back to homepage
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-red-600 font-medium">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto text-red-800">
                                    {error.message}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-playful-background">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-8xl font-bold text-playful-primary mb-4 animate-bounce">404</h1>
                    <h2 className="text-3xl font-bold text-playful-foreground mb-4">Oops! Page not found</h2>
                    <p className="text-lg text-playful-foreground/80 mb-8">
                        The page you're looking for doesn't exist. Let's get you back to the fun stuff!
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-block bg-playful-primary hover:bg-playful-accent text-white font-bold py-4 px-8 rounded-full shadow-2d hover:shadow-none transition-all transform hover:-translate-y-1"
                    >
                        🏠 Back to Home
                    </Link>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="inline-block bg-playful-secondary hover:bg-playful-primary text-white font-semibold py-3 px-6 rounded-full shadow-2d hover:shadow-none transition-all"
                        >
                            🛍️ Browse Products
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-block bg-playful-accent hover:bg-playful-primary text-white font-semibold py-3 px-6 rounded-full shadow-2d hover:shadow-none transition-all"
                        >
                            📞 Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

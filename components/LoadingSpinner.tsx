"use client";

import { Loader2, Heart, Star } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "default" | "cute" | "minimal";
    message?: string;
    className?: string;
}

const LoadingSpinner = ({
    size = "md",
    variant = "default",
    message = "Loading magical goodies...",
    className = ""
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16"
    };

    const containerClasses = {
        sm: "gap-2 text-sm",
        md: "gap-3 text-base",
        lg: "gap-4 text-lg",
        xl: "gap-6 text-xl"
    };

    if (variant === "cute") {
        return (
            <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
                <div className="relative">
                    {/* Spinning hearts */}
                    <div className="relative animate-spin">
                        <Heart className={`${sizeClasses[size]} text-playful-primary fill-playful-primary`} />
                    </div>

                    {/* Floating sparkles */}
                    <div className="absolute -top-2 -right-2 animate-bounce">
                        <Star className="h-3 w-3 text-playful-accent fill-playful-accent" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
                        <Star className="h-3 w-3 text-playful-secondary fill-playful-secondary" />
                    </div>
                </div>

                {message && (
                    <p className="text-playful-foreground/80 font-medium animate-pulse text-center max-w-xs">
                        {message}
                    </p>
                )}
            </div>
        );
    }

    if (variant === "minimal") {
        return (
            <div className={`flex items-center justify-center ${containerClasses[size]} ${className}`}>
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-playful-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-playful-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-playful-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        );
    }

    // Default variant
    return (
        <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
            <div className="relative">
                <Loader2 className={`${sizeClasses[size]} animate-spin text-playful-primary`} />

                {/* Pulsing ring */}
                <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-playful-accent/30 rounded-full animate-ping`}></div>
            </div>

            {message && (
                <p className="text-playful-foreground/80 font-medium animate-pulse text-center max-w-xs">
                    {message}
                </p>
            )}
        </div>
    );
};

// Full page loading component
export const PageLoader = ({ message = "Loading your magical experience..." }: { message?: string }) => {
    return (
        <div className="fixed inset-0 bg-playful-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl border-4 border-playful-foreground shadow-2xl p-8 max-w-sm mx-4">
                <LoadingSpinner size="xl" variant="cute" message={message} />
            </div>
        </div>
    );
};

// Skeleton loader for product cards
export const ProductCardSkeleton = () => {
    return (
        <div className="animate-pulse bg-white rounded-3xl border-4 border-playful-foreground shadow-2d flex flex-col overflow-hidden">
            <div className="p-4 flex-grow">
                {/* Image placeholder */}
                <div className="h-48 w-full bg-playful-accent/20 rounded-2xl border-2 border-playful-foreground/10 mb-4"></div>

                {/* Content placeholders */}
                <div className="space-y-3">
                    <div className="h-6 bg-playful-foreground/10 rounded w-3/4"></div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="h-4 bg-playful-foreground/10 rounded w-12"></div>
                    </div>
                    <div className="h-8 bg-playful-foreground/10 rounded w-2/3"></div>
                    <div className="flex gap-2">
                        <div className="h-6 bg-playful-accent/20 rounded-full w-16"></div>
                        <div className="h-6 bg-playful-accent/20 rounded-full w-20"></div>
                    </div>
                </div>
            </div>

            {/* Footer placeholders */}
            <div className="p-4 pt-0 space-y-2">
                <div className="h-12 bg-playful-primary/20 rounded w-full"></div>
                <div className="flex gap-2">
                    <div className="h-10 bg-playful-foreground/10 rounded flex-1"></div>
                    <div className="h-10 w-10 bg-playful-foreground/10 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
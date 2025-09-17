"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    // Scroll to top on route change (except admin pages)
    useEffect(() => {
        if (!pathname.startsWith("/admin000")) {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    // Show/hide scroll to top button
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isVisible && (
                <Button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl border-4 border-playful-foreground animate-bounce hover:animate-none transition-all duration-300 hover:scale-110 bg-gradient-to-r from-playful-primary to-playful-accent"
                    size="icon"
                >
                    <ArrowUp className="h-6 w-6" />
                    <span className="sr-only">Scroll to top</span>
                </Button>
            )}
        </>
    );
};

export default ScrollToTop;

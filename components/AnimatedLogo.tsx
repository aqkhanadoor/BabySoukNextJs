"use client";

const AnimatedLogo = () => {
    return (
        <div className="flex items-center space-x-1">
            <div className="transition-transform duration-300 hover:scale-125">
                <img src="/assets/logo/B.webp" alt="B" className="mt-2 h-10 w-10 animate-bounce-slow" />
            </div>
            <img src="/assets/logo/a.webp" alt="a" className="h-7 w-7 animate-fade-in transition-transform duration-300 hover:scale-125" />
            <img src="/assets/logo/b (2).webp" alt="b" className="h-7 w-7 animate-slide-in-left transition-transform duration-300 hover:scale-125" />
            <img src="/assets/logo/y.webp" alt="y" className="h-7 w-7 animate-slide-in-right transition-transform duration-300 hover:scale-125" />
            <div className="transition-transform duration-300 hover:scale-125">
                <img src="/assets/logo/S.webp" alt="S" className="h-10 w-10 animate-spin-slower" />
            </div>
            <img src="/assets/logo/o.webp" alt="o" className="h-7 w-7 animate-pulse-soft transition-transform duration-300 hover:scale-125" />
            <img src="/assets/logo/u.webp" alt="u" className="h-7 w-7 animate-fade-in transition-transform duration-300 hover:scale-125" />
            <div className="transition-transform duration-300 hover:scale-125">
                <img src="/assets/logo/k.webp" alt="k" className="h-7 w-7 animate-bounce-slow" />
            </div>
        </div>
    );
};

export default AnimatedLogo;

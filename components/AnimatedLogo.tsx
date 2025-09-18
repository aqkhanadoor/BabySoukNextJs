"use client";

import Image from "next/image";

const AnimatedLogo = () => {
    return (
        <div className="flex items-center space-x-1">
            <div className="transition-transform duration-300 hover:scale-125">
                <Image src="/assets/logo/B.webp" alt="BabySouk Logo - Letter B" width={40} height={40} className="mt-2 h-10 w-10 animate-bounce-slow" />
            </div>
            <Image src="/assets/logo/a.webp" alt="BabySouk Logo - Letter a" width={28} height={28} className="h-7 w-7 animate-fade-in transition-transform duration-300 hover:scale-125" />
            <Image src="/assets/logo/b (2).webp" alt="BabySouk Logo - Letter b" width={28} height={28} className="h-7 w-7 animate-slide-in-left transition-transform duration-300 hover:scale-125" />
            <Image src="/assets/logo/y.webp" alt="BabySouk Logo - Letter y" width={28} height={28} className="h-7 w-7 animate-slide-in-right transition-transform duration-300 hover:scale-125" />
            <div className="transition-transform duration-300 hover:scale-125">
                <Image src="/assets/logo/S.webp" alt="BabySouk Logo - Letter S" width={40} height={40} className="h-10 w-10 animate-spin-slower" />
            </div>
            <Image src="/assets/logo/o.webp" alt="BabySouk Logo - Letter o" width={28} height={28} className="h-7 w-7 animate-pulse-soft transition-transform duration-300 hover:scale-125" />
            <Image src="/assets/logo/u.webp" alt="BabySouk Logo - Letter u" width={28} height={28} className="h-7 w-7 animate-fade-in transition-transform duration-300 hover:scale-125" />
            <div className="transition-transform duration-300 hover:scale-125">
                <Image src="/assets/logo/k.webp" alt="BabySouk Logo - Letter k" width={28} height={28} className="h-7 w-7 animate-bounce-slow" />
            </div>
        </div>
    );
};

export default AnimatedLogo;

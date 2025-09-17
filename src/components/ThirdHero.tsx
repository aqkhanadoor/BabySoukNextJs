"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { onValue, ref as dbRef } from "firebase/database";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const ThirdHero = () => {
    const [desktopImages, setDesktopImages] = useState<string[]>(["", "", ""]);
    const [mobileImages, setMobileImages] = useState<string[]>(["", "", ""]);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const isMobile = useIsMobile();
    const [links, setLinks] = useState<string[]>(["", "", ""]);

    useEffect(() => {
        const ref = dbRef(db, "homepage/hero3");
        const unsub = onValue(ref, (snap) => {
            const val = snap.val() as { images?: string[]; desktop?: string[]; mobile?: string[]; links?: string[] } | null;
            if (val?.desktop?.length) {
                const arr = val.desktop.slice(0, 3);
                setDesktopImages([arr[0] || "", arr[1] || "", arr[2] || ""]);
            } else if (val?.images?.length) {
                const arr = val.images.slice(0, 3);
                setDesktopImages([arr[0] || "", arr[1] || "", arr[2] || ""]);
            } else {
                setDesktopImages(["", "", ""]);
            }
            if (val?.mobile?.length) {
                const arr = val.mobile.slice(0, 3);
                setMobileImages([arr[0] || "", arr[1] || "", arr[2] || ""]);
            } else if (val?.images?.length) {
                const arr = val.images.slice(0, 3);
                setMobileImages([arr[0] || "", arr[1] || "", arr[2] || ""]);
            } else {
                setMobileImages(["", "", ""]);
            }
            if (val?.links?.length) {
                const l = val.links.slice(0, 3);
                setLinks([l[0] || "", l[1] || "", l[2] || ""]);
            } else {
                setLinks(["", "", ""]);
            }
        });
        return () => unsub();
    }, []);

    const slides = useMemo(() => {
        const chosen = isMobile
            ? (mobileImages.some(Boolean) ? mobileImages : desktopImages)
            : desktopImages;
        return chosen.map((src, idx) => ({ src, idx })).filter((s) => !!s.src);
    }, [isMobile, desktopImages, mobileImages]);

    useEffect(() => {
        if (!api) return;
        if (slides.length < 2) return;
        const id = setInterval(() => api.scrollNext(), 5000);
        return () => clearInterval(id);
    }, [api, slides.length]);

    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    if (slides.length === 0) return null;

    const renderLinkedBlock = (src: string, index: number) => {
        const href = (links[index] && links[index].trim()) || "/products";
        const isExternal = /^https?:\/\//i.test(href);
        const content = (
            <div className="grid place-items-center p-2">
                <div className="relative w-full max-w-7xl rounded-3xl overflow-hidden shadow-2d border-4 border-playful-foreground transition-all duration-300 group-hover:shadow-none group-hover:-translate-y-1">
                    <img src={src} className="w-full h-[340px] md:h-[500px] object-fill transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
            </div>
        );
        return isExternal ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block group">{content}</a>
        ) : (
            <Link href={href} className="block group">{content}</Link>
        );
    };

    return (
        <section className="relative overflow-hidden bg-playful-background py-12 md:py-20">
            <div className="container mx-auto px-4">
                {slides.length >= 2 ? (
                    <div className="relative">
                        <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
                            <CarouselContent>
                                {slides.slice(0, 3).map(({ src, idx }) => (
                                    <CarouselItem key={idx}>
                                        {renderLinkedBlock(src, idx)}
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 md:left-8" />
                            <CarouselNext className="right-2 md:right-8" />
                        </Carousel>
                        <div className="flex justify-center mt-6 gap-3">
                            {slides.slice(0, 3).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => api?.scrollTo(i)}
                                    className={`w-4 h-4 rounded-full transition-all duration-300 border-2 border-playful-foreground ${current === i ? "bg-playful-primary scale-125 shadow-2d" : "bg-white/50 hover:bg-playful-accent/50"
                                        }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    renderLinkedBlock(slides[0].src, slides[0].idx)
                )}
            </div>
        </section>
    );
};

export default ThirdHero;

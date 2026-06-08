"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const SLIDES = [
  {
    title: "Zimbabwe's trusted marketplace",
    subtitle: "Buy & sell safely with verified sellers",
    cta: "Learn more",
    href: "/about",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    bg: "from-bob-purple/90 to-bob-navy/90",
  },
  {
    title: "Pay with EcoCash & Paynow",
    subtitle: "Local payment options for every order",
    cta: "Shop now",
    href: "/search",
    image: "https://images.unsplash.com/photo-1563013547-7f1cc05b1d6f?w=800&h=400&fit=crop",
    bg: "from-brand-700/90 to-brand-900/90",
  },
  {
    title: "Sell on ZimHub",
    subtitle: "Reach buyers across Zimbabwe",
    cta: "Start selling",
    href: "/register?seller=true",
    image: "https://images.unsplash.com/photo-1556745757-8d9025751af8?w=800&h=400&fit=crop",
    bg: "from-bob-navy/90 to-bob-purple/90",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative aspect-[16/7] min-h-[200px] sm:min-h-[280px]">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 700px"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <h2 className="max-w-md text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {slide.title}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-white/80 sm:text-base">
            {slide.subtitle}
          </p>
          <Link
            href={slide.href}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            {slide.cta}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === current ? "bg-brand-500" : "bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

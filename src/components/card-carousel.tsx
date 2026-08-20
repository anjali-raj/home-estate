'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

/**
 * Swipeable image carousel for listing cards. Uses native scroll-snap so touch
 * devices swipe for free; arrows appear on hover for pointer devices. Dots
 * reflect and control the active slide. Lives OUTSIDE the card's link so its
 * controls are valid, focusable interactive elements.
 */
export function CardCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive((prev) => (prev === index ? prev : index));
  }, []);

  const goTo = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  }, []);

  const step = (dir: 1 | -1) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = Math.min(images.length - 1, Math.max(0, active + dir));
    goTo(next);
  };

  const single = images.length <= 1;

  return (
    <div className="group/carousel relative aspect-[4/3] overflow-hidden bg-border">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${alt} — ${images.length} photos`}
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full flex-none snap-center">
            <Image
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {!single && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={step(-1)}
            disabled={active === 0}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-surface/90 p-1.5 text-foreground shadow backdrop-blur transition group-hover/carousel:grid disabled:opacity-0"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={step(1)}
            disabled={active === images.length - 1}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-surface/90 p-1.5 text-foreground shadow backdrop-blur transition group-hover/carousel:grid disabled:opacity-0"
          >
            <Chevron dir="right" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

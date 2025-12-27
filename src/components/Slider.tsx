import React, { useEffect, useRef, useState, useId } from 'react';

interface SliderProps {
  children: React.ReactNode;
  ariaLabel?: string;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ children, ariaLabel = 'Carousel', showArrows = true, showDots = true, className = '' }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Use React's useId for a stable id instead of calling Math.random during render
  const uid = useId();
  const id = `slider-${uid}`;

  const childrenArray = React.Children.toArray(children);

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const node = items[index];
    if (node) node.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  };

  const scrollByPage = (direction: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;

    const page = el.clientWidth;
    const amount = direction === 'next' ? page : -page;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = items.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIndex(idx);
          }
        });
      },
      { threshold: [0.5] }
    );

    items.forEach((it) => observer.observe(it));

    const onResize = () => {
      // Ensure active item stays visible after resize
      const node = items[activeIndex];
      if (node) node.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    globalThis.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      globalThis.removeEventListener('resize', onResize);
    };
  }, [activeIndex]);

  // Global keyboard navigation (keeps element itself free of keyboard handlers)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(activeIndex + 1, childrenArray.length - 1);
        scrollToIndex(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(activeIndex - 1, 0);
        scrollToIndex(prev);
      }
    };

    globalThis.addEventListener('keydown', handler);
    return () => globalThis.removeEventListener('keydown', handler);
  }, [activeIndex, childrenArray.length]);

  return (
    <div className={`relative ${className}`}>
      {showArrows && (
        <button
          aria-label="Previous"
          onClick={() => scrollByPage('prev')}
          className={`hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border shadow-sm transition-opacity ${activeIndex > 0 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
        >
          ‹
        </button>
      )}

      <section
        id={id}
        ref={trackRef}
        aria-label={ariaLabel}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth py-6 px-4 md:px-8"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {childrenArray.map((child, i) => (
          <div key={`${id}-slide-${i}`} className="snap-start flex-shrink-0" aria-hidden={activeIndex !== i}>
            {child}
          </div>
        ))}
      </section>

      {showArrows && (
        <button
          aria-label="Next"
          onClick={() => scrollByPage('next')}
          className={`hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border shadow-sm transition-opacity ${activeIndex < childrenArray.length - 1 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
        >
          ›
        </button>
      )}

      {showDots && (
        <div role="tablist" aria-label="Carousel Dots" className="flex items-center justify-center gap-2 mt-4 md:hidden">
          {childrenArray.map((_, i) => (
            <button
              key={`${id}-dot-${i}`}
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Go to slide ${i + 1}`}
              aria-controls={id}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full ${activeIndex === i ? 'bg-slate-700' : 'bg-slate-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;


'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useGSAP, gsap } from '@/hooks/useGSAP';

const HeroCanvas = dynamic(() => import('@/components/canvas/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const canvas = canvasRef.current;

    // Initial entrance animation for hero content
    const entranceTl = gsap.timeline({ delay: 0.3 });

    if (title) {
      gsap.set(title, { opacity: 0, y: 30 });
      entranceTl.to(title, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      });
    }

    if (subtitle) {
      gsap.set(subtitle, { opacity: 0, y: 20 });
      entranceTl.to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.6'
      );
    }

    if (scrollIndicator) {
      gsap.set(scrollIndicator, { opacity: 0 });
      entranceTl.to(
        scrollIndicator,
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    }

    // Parallax effect on scroll - title moves up faster
    if (title) {
      gsap.to(title, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Subtitle parallax - slightly slower
    if (subtitle) {
      gsap.to(subtitle, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Canvas parallax - slowest
    if (canvas) {
      gsap.to(canvas, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Fade out hero content as user scrolls
    gsap.to([title, subtitle], {
      opacity: 0,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '50% top',
        scrub: true,
      },
    });

    // Hide scroll indicator when scrolling starts
    if (scrollIndicator) {
      gsap.to(scrollIndicator, {
        opacity: 0,
        y: -20,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '20% top',
          scrub: true,
        },
      });
    }
  }, { dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-testid="hero-section"
      className="snap-section relative h-screen w-full overflow-hidden bg-background"
    >
      {/* 3D Canvas - positioned behind text */}
      <div ref={canvasRef} className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Text overlay - pointer-events-none to allow canvas interaction */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          ref={titleRef}
          data-testid="hero-title"
          className="text-display mb-6 text-foreground"
        >
          Winter &apos;26
        </h1>
        <p
          ref={subtitleRef}
          data-testid="hero-subtitle"
          className="text-body-lg max-w-2xl text-foreground-muted"
        >
          Discover what&apos;s new in Shopify Editions
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-caption text-foreground-muted">Scroll</span>
          <div className="h-8 w-px animate-pulse bg-foreground-muted" />
        </div>
      </div>
    </section>
  );
}

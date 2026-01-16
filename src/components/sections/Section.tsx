'use client';

import { ReactNode, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useGSAP, gsap } from '@/hooks/useGSAP';

const TransitionCanvas = dynamic(
  () => import('@/components/canvas/TransitionCanvas'),
  { ssr: false }
);

export interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  children?: ReactNode;
  className?: string;
  parallaxSpeed?: number;
  transitionColors?: {
    from: string;
    to: string;
  };
}

export default function Section({
  id,
  title,
  subtitle,
  description,
  backgroundColor = 'bg-background',
  textColor = 'text-foreground',
  children,
  className = '',
  parallaxSpeed = 0.3,
  transitionColors,
}: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;

      const section = sectionRef.current;
      const background = backgroundRef.current;

      // Set initial state for content elements (hidden)
      const textElements = [
        subtitleRef.current,
        titleRef.current,
        descriptionRef.current,
      ].filter(Boolean);

      gsap.set(textElements, {
        opacity: 0,
        y: 50,
      });

      if (childrenRef.current) {
        gsap.set(childrenRef.current, {
          opacity: 0,
          y: 30,
        });
      }

      // Create timeline for staggered text animations on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      });

      // Staggered fade-in for text elements
      tl.to(textElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Fade in children (3D content) after text
      if (childrenRef.current) {
        tl.to(
          childrenRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4' // Overlap with previous animation
        );
      }

      // Parallax effect on background
      if (background) {
        gsap.to(background, {
          yPercent: -parallaxSpeed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Fade out when leaving viewport (scrolling down)
      gsap.to(contentRef.current, {
        opacity: 0.3,
        scrollTrigger: {
          trigger: section,
          start: 'bottom 60%',
          end: 'bottom 20%',
          scrub: true,
        },
      });
    },
    { dependencies: [id, parallaxSpeed] }
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      data-testid={`section-${id}`}
      className={`snap-section relative min-h-screen w-full overflow-hidden py-20 ${backgroundColor} ${textColor} ${className}`}
    >
      {/* Parallax background layer */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 -top-[10%] -bottom-[10%] z-0"
        data-testid={`section-background-${id}`}
      />

      {/* Shader transition background */}
      {transitionColors && (
        <TransitionCanvas
          colorFrom={transitionColors.from}
          colorTo={transitionColors.to}
        />
      )}

      {/* Content container */}
      <div ref={contentRef} className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16">
          {subtitle && (
            <p
              ref={subtitleRef}
              className="text-body-sm mb-4 uppercase tracking-wider opacity-70"
              data-testid={`section-subtitle-${id}`}
            >
              {subtitle}
            </p>
          )}
          <h2
            ref={titleRef}
            data-testid={`section-title-${id}`}
            className="text-h1 mb-6"
          >
            {title}
          </h2>
          {description && (
            <p
              ref={descriptionRef}
              className="text-body-lg max-w-2xl opacity-80"
              data-testid={`section-description-${id}`}
            >
              {description}
            </p>
          )}
        </div>

        {/* Section content with 3D element */}
        <div
          ref={childrenRef}
          className="relative min-h-[400px]"
          data-testid={`section-content-${id}`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

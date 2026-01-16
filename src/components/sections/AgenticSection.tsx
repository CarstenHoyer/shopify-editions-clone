'use client';

import dynamic from 'next/dynamic';
import Section from './Section';

const SectionCanvas = dynamic(
  () => import('@/components/canvas/SectionCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-purple border-t-transparent" />
      </div>
    ),
  }
);

export default function AgenticSection() {
  return (
    <Section
      id="agentic"
      title="Agentic Commerce"
      subtitle="Autonomous Operations"
      description="Let intelligent agents handle routine tasks autonomously, from inventory management to customer support, while you focus on growth."
      backgroundColor="bg-background"
      textColor="text-foreground"
      transitionColors={{ from: '#95bf47', to: '#5c4dff' }}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <SectionCanvas geometryType="octahedron" color="#5c4dff" />
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-purple" />
              <span className="text-body-sm text-foreground-muted">
                Autonomous decision making
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-purple" />
              <span className="text-body-sm text-foreground-muted">
                Multi-agent workflows
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-purple" />
              <span className="text-body-sm text-foreground-muted">
                Real-time optimization
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

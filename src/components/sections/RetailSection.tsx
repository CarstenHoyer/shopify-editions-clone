'use client';

import dynamic from 'next/dynamic';
import Section from './Section';

const SectionCanvas = dynamic(
  () => import('@/components/canvas/SectionCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-teal border-t-transparent" />
      </div>
    ),
  }
);

export default function RetailSection() {
  return (
    <Section
      id="retail"
      title="Retail & POS"
      subtitle="In-Person Sales"
      description="Unify your online and in-store experiences with our next-generation point of sale system, seamless inventory sync, and customer insights."
      backgroundColor="bg-background"
      textColor="text-foreground"
      transitionColors={{ from: '#0066cc', to: '#00a3bf' }}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <SectionCanvas geometryType="cylinder" color="#00a3bf" />
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-teal" />
              <span className="text-body-sm text-foreground-muted">
                Unified inventory
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-teal" />
              <span className="text-body-sm text-foreground-muted">
                Staff management
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-teal" />
              <span className="text-body-sm text-foreground-muted">
                Customer profiles
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

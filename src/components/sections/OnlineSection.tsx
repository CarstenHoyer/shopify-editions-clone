'use client';

import dynamic from 'next/dynamic';
import Section from './Section';

const SectionCanvas = dynamic(
  () => import('@/components/canvas/SectionCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-blue border-t-transparent" />
      </div>
    ),
  }
);

export default function OnlineSection() {
  return (
    <Section
      id="online"
      title="Online Store"
      subtitle="Digital Commerce"
      description="Build stunning, high-converting storefronts with our enhanced theme editor, lightning-fast checkout, and powerful customization tools."
      backgroundColor="bg-gray-900"
      textColor="text-foreground"
      transitionColors={{ from: '#5c4dff', to: '#0066cc' }}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-blue" />
              <span className="text-body-sm text-foreground-muted">
                Drag-and-drop editor
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-blue" />
              <span className="text-body-sm text-foreground-muted">
                Performance optimized
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-blue" />
              <span className="text-body-sm text-foreground-muted">
                Mobile-first design
              </span>
            </div>
          </div>
        </div>
        <SectionCanvas geometryType="sphere" color="#0066cc" />
      </div>
    </Section>
  );
}

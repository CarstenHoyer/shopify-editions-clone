'use client';

import dynamic from 'next/dynamic';
import Section from './Section';

const SectionCanvas = dynamic(
  () => import('@/components/canvas/SectionCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-shopify-green border-t-transparent" />
      </div>
    ),
  }
);

export default function SidekickSection() {
  return (
    <Section
      id="sidekick"
      title="Sidekick"
      subtitle="AI Assistant"
      description="Your AI-powered commerce assistant that helps you build, market, and manage your business with intelligent suggestions and automated workflows."
      backgroundColor="bg-gray-900"
      textColor="text-foreground"
      transitionColors={{ from: '#1a1a1a', to: '#95bf47' }}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-shopify-green" />
              <span className="text-body-sm text-foreground-muted">
                Smart recommendations
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-shopify-green" />
              <span className="text-body-sm text-foreground-muted">
                Automated tasks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-shopify-green" />
              <span className="text-body-sm text-foreground-muted">
                Natural language interface
              </span>
            </div>
          </div>
        </div>
        <SectionCanvas geometryType="torus" color="#95bf47" />
      </div>
    </Section>
  );
}

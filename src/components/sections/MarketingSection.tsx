'use client';

import dynamic from 'next/dynamic';
import Section from './Section';

const SectionCanvas = dynamic(
  () => import('@/components/canvas/SectionCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow border-t-transparent" />
      </div>
    ),
  }
);

export default function MarketingSection() {
  return (
    <Section
      id="marketing"
      title="Marketing"
      subtitle="Growth Tools"
      description="Reach more customers with AI-powered marketing tools, automated campaigns, and deep analytics to understand what drives conversions."
      backgroundColor="bg-gray-900"
      textColor="text-foreground"
      transitionColors={{ from: '#00a3bf', to: '#ffd000' }}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-yellow" />
              <span className="text-body-sm text-foreground-muted">
                Email automation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-yellow" />
              <span className="text-body-sm text-foreground-muted">
                Social integrations
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-yellow" />
              <span className="text-body-sm text-foreground-muted">
                Advanced analytics
              </span>
            </div>
          </div>
        </div>
        <SectionCanvas geometryType="cone" color="#ffd000" />
      </div>
    </Section>
  );
}

'use client';

import dynamic from 'next/dynamic';
import Section from './Section';

const SectionCanvas = dynamic(
  () => import('@/components/canvas/SectionCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-red border-t-transparent" />
      </div>
    ),
  }
);

export default function CheckoutSection() {
  return (
    <Section
      id="checkout"
      title="Checkout"
      subtitle="Conversion Optimized"
      description="Maximize conversions with our fastest checkout ever, featuring one-click payments, Shop Pay integration, and intelligent fraud protection."
      backgroundColor="bg-background"
      textColor="text-foreground"
      transitionColors={{ from: '#ffd000', to: '#e31b23' }}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <SectionCanvas geometryType="dodecahedron" color="#e31b23" />
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="text-body-sm text-foreground-muted">
                One-click checkout
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="text-body-sm text-foreground-muted">
                Shop Pay acceleration
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="text-body-sm text-foreground-muted">
                Fraud protection
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

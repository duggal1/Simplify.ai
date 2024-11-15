'use client';

import dynamic from 'next/dynamic';

const DataExtractionContent = dynamic(
  () => import('@/components/DataExtractionContent'),
  { ssr: true }
);

export default function DataExtractionPage() {
  return <DataExtractionContent />;
}
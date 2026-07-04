'use client';

import dynamic from 'next/dynamic';
import Dashboard from '@/components/Dashboard';

const InitialScene = dynamic(() => import('@/experience/components/InitialScene'), { ssr: false });

export default function ManifestSpace() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <InitialScene />
      <Dashboard />
    </div>
  );
}

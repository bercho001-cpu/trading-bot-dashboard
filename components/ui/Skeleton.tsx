import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-700 rounded ${className}`} />;
}

export default Skeleton;

import React from 'react';

export function Button({ children, onClick, variant = 'primary', className = '', disabled = false }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost'; className?: string; disabled?: boolean }) {
  const base = 'px-3 py-1 rounded text-sm font-medium';
  const variants: Record<string, string> = {
    primary: 'bg-cyan-600 text-white hover:bg-cyan-700',
    ghost: 'bg-transparent text-slate-300 border border-slate-700 hover:bg-slate-800',
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;

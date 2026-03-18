import type { MouseEventHandler } from 'react';

interface FilterButtonProps {
  isActive: boolean;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function FilterButton({
  label,
  isActive,
  onClick,
}: FilterButtonProps) {
  const activeStyle = isActive
    ? 'bg-red-900/20 border-red-900 text-red-800 shadow-[0_0_10px_rgba(220,38,38,0.2)]'
    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300';
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-2 py-2 border transition-all duration-200 rounded-sm ${activeStyle}`}
    >
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
        {label}
      </span>
      <div
        className={`ml-1 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-red-600 animate-pulse' : 'bg-zinc-800'}`}
      />
    </button>
  );
}

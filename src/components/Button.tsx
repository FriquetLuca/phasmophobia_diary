import type { MouseEventHandler } from 'react';

interface ButtonProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        'ml-auto mt-auto w-fit h-fit flex items-center justify-center px-2 py-2 border transition-all duration-200 rounded-sm bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
      }
    >
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
        {label}
      </span>
    </button>
  );
}

import type { Ghost } from '../datas';

interface GhostCardProps {
  ghost: Ghost;
  name: string;
  active: boolean;
  onSelect: (ghost: Ghost) => void;
}

export default function GhostSelector({
  ghost,
  name,
  active,
  onSelect,
}: GhostCardProps) {
  return (
    <div
      className={`
        group cursor-pointer py-3 px-4 transition-all duration-300 relative overflow-hidden
        ${
          active
            ? 'bg-zinc-900/50 hover:bg-zinc-800'
            : 'opacity-20 grayscale hover:opacity-40'
        }
      `}
      onClick={() => onSelect(ghost)}
    >
      {active && (
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-size-[100%_4px] pointer-events-none" />
      )}
      <div className="flex items-center justify-center relative z-10">
        <p
          className={`
          text-lg cmu_serif uppercase tracking-widest transition-colors
          ${active ? 'text-zinc-100 group-hover:text-red-500' : 'text-zinc-600 line-through decoration-zinc-400'}
        `}
        >
          {name}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 h-px bg-red-600 transition-all duration-500 w-0 group-hover:w-full" />
    </div>
  );
}

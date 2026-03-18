interface HuntSpeedPlayerProps {
  label: string;
  speed: number;
  isLoaded: boolean;
  play: (speed: number) => Promise<void>;
  stop: () => void;
}

export default function HuntSpeedPlayer({
  label,
  speed,
  isLoaded,
  play,
  stop,
}: HuntSpeedPlayerProps) {
  return (
    <div className="flex items-stretch border border-zinc-800 bg-zinc-950/40 group overflow-hidden rounded-sm last:mb-0">
      <div className="flex-1 flex justify-between items-center px-4 py-3 border-r border-zinc-800">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
            {label}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="font-mono text-sm text-red-500 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.2)]">
            {speed}
          </span>
          <span className="text-xs font-mono text-zinc-600 tracking-tighter">
            m/s
          </span>
        </div>
      </div>
      <button
        disabled={!isLoaded}
        onMouseDown={() => play(speed)}
        onMouseUp={stop}
        onMouseLeave={stop}
        // Mobile support
        onTouchStart={() => play(speed)}
        onTouchEnd={stop}
        className={`
                    w-16 flex items-center justify-center transition-all duration-150 relative
                    ${
                      isLoaded
                        ? 'bg-zinc-900 text-zinc-400 hover:bg-red-900/20 hover:text-red-500 active:bg-red-600 active:text-white'
                        : 'bg-zinc-950 text-zinc-800 cursor-not-allowed'
                    }
                `}
      >
        <div
          className={`
                    absolute top-1 right-1 w-1 h-1 rounded-full 
                    ${isLoaded ? 'bg-green-500/50 shadow-[0_0_5px_green]' : 'bg-zinc-800'}
                `}
        />

        {isLoaded ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold uppercase tracking-tighter">
              🔊
            </span>
            <div className="flex gap-0.5 h-2 items-center">
              <div className="w-0.5 h-full bg-current animate-pulse" />
              <div className="w-0.5 h-2/3 bg-current" />
              <div className="w-0.5 h-full bg-current animate-pulse delay-75" />
            </div>
          </div>
        ) : (
          <span className="animate-pulse">...</span>
        )}
      </button>
    </div>
  );
}

import EvidenceIcon from './EvidenceIcon';
import type { Evidence } from '../datas';
import { useTranslation } from 'react-i18next';

export type EvidenceState = 'neutral' | 'found' | 'hidden';

interface EvidenceButtonProps {
  evidence: Evidence;
  state: EvidenceState;
  onClick: () => void;
}

export default function EvidenceButton({
  evidence,
  state,
  onClick,
}: EvidenceButtonProps) {
  const { t } = useTranslation();

  const isHidden = state === 'hidden';

  const getStyles = () => {
    switch (state) {
      case 'found':
        return 'bg-zinc-100 border-zinc-100 text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]';
      case 'hidden':
        return 'bg-zinc-950/40 border-zinc-800 text-zinc-600 opacity-40 grayscale';
      default:
        return 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-start px-3 gap-3 border-2 transition-all duration-200 py-2 rounded-sm group relative overflow-hidden ${getStyles()}`}
    >
      <div className="relative z-10 shrink-0">
        <EvidenceIcon evidence={evidence} />
        {isHidden && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1.5px] bg-red-300 rotate-45 absolute opacity-60" />
            <div className="w-full h-[1.5px] bg-red-300 -rotate-45 absolute opacity-60" />
          </div>
        )}
      </div>
      <div className="relative z-10">
        <span className="text-[10px] uppercase font-bold tracking-wider leading-none block">
          {t(`evidences.${evidence}`)}
        </span>
        {isHidden && (
          <div className="absolute top-1/2 -left-1 -right-1 h-px bg-red-400/80 -rotate-2 pointer-events-none" />
        )}
      </div>
      {state === 'found' && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_2px] pointer-events-none opacity-20" />
      )}
    </button>
  );
}

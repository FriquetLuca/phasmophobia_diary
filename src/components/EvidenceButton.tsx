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

  const getStyles = () => {
    switch (state) {
      case 'found':
        return 'bg-green-100 border-green-600 opacity-100 shadow-inner';
      case 'hidden':
        return 'bg-red-50 border-gray-300 opacity-40 line-through grayscale';
      default:
        return 'bg-white border-gray-200 opacity-100 hover:border-black';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 gap-2 border-2 transition-all py-1 rounded-md ${getStyles()}`}
    >
      <div className="relative">
        <EvidenceIcon evidence={evidence} />
        {state === 'hidden' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-1 bg-red-600 rotate-45 absolute" />
            <div className="w-full h-1 bg-red-600 -rotate-45 absolute" />
          </div>
        )}
      </div>
      <span className="text-xs uppercase font-bold text-center leading-none">
        {t(`evidences.${evidence}`)}
      </span>
    </button>
  );
}

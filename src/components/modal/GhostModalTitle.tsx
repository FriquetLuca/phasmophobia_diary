import type { Evidence } from '../../datas';
import EvidenceIcon from '../EvidenceIcon';

interface GhostModalTitleProps {
  title: string;
  evidences: Evidence[];
  onClose: () => void;
}

export default function GhostModalTitle({
  title,
  evidences,
  onClose,
}: GhostModalTitleProps) {
  return (
    <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
      <div className="w-full flex justify-center items-center">
        <h2 className="text-3xl cmu_serif text-zinc-100 tracking-widest">
          {title}
        </h2>
        <div className="flex ml-6 gap-2">
          {evidences.map((e, i) => (
            <EvidenceIcon key={i} evidence={e} />
          ))}
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-zinc-500 hover:text-zinc-100 transition-colors font-mono text-3xl"
      >
        ×
      </button>
    </div>
  );
}

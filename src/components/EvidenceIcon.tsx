import type { Evidence } from '../datas';
import { useTranslation } from 'react-i18next';

interface EvidenceIconProps {
  evidence: Evidence;
}

const evidenceToSrc: Record<Evidence, string> = {
  dots: 'dots-projector.webp',
  orb: 'ghost-orb.webp',
  spirit: 'spirit-box.webp',
  book: 'writing-book.webp',
  emf: 'emf-reader.webp',
  freezing: 'thermometer.webp',
  uv: 'fingerprints.webp',
};

export default function EvidenceIcon({ evidence }: EvidenceIconProps) {
  const { t } = useTranslation();
  return (
    <img
      className="w-6 h-6"
      src={`/icons/${evidenceToSrc[evidence]}`}
      alt={t(`evidences.${evidence}`)}
    />
  );
}

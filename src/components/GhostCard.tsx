import { useTranslation } from 'react-i18next';
import type { Ghost } from '../datas';

interface GhostCardProps {
  ghost: Ghost;
  active: boolean;
  onSelect: (ghost: Ghost) => void;
}

export default function GhostCard({ ghost, active, onSelect }: GhostCardProps) {
  const { t } = useTranslation();

  const activeText = active ? 'text-gray-800' : 'text-gray-200';

  return (
    <div className="group cursor-pointer py-2" onClick={() => onSelect(ghost)}>
      <p className={`text-xl text-center font-medium ${activeText}`}>
        {t(`ghosts.${ghost.name}.name`)}
      </p>
    </div>
  );
}

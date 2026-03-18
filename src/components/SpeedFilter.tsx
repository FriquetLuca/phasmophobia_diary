import { useTranslation } from 'react-i18next';
import type { SpeedTrait } from '../datas';
import FilterButton from './FilterButton';

export default function SpeedFilter({
  activeTraits,
  toggleTrait,
}: {
  activeTraits: SpeedTrait[];
  toggleTrait: (trait: SpeedTrait) => void;
}) {
  const { t } = useTranslation();

  const traits: SpeedTrait[] = ['standard', 'variable', 'fast', 'slow'];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {t('hunt.speed.title')}
        </span>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>

      <div className="grid grid-cols-2 gap-1">
        {traits.map((trait) => {
          return (
            <FilterButton
              key={trait}
              isActive={activeTraits.includes(trait)}
              label={t(`hunt.speed.${trait}`)}
              onClick={() => toggleTrait(trait)}
            />
          );
        })}
      </div>
    </div>
  );
}

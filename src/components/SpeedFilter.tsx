import { useTranslation } from 'react-i18next';

export type SpeedTrait = 'fast' | 'slow' | 'standard';

export default function SpeedFilter({
  activeTraits,
  toggleTrait,
}: {
  activeTraits: SpeedTrait[];
  toggleTrait: (trait: SpeedTrait) => void;
}) {
  const { t } = useTranslation();

  const traits: SpeedTrait[] = ['standard', 'fast', 'slow'];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {t('filters.speed.title')}
        </span>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>

      <div className="grid grid-cols-3 gap-1">
        {traits.map((trait) => {
          const isActive = activeTraits.includes(trait);
          return (
            <button
              key={trait}
              onClick={() => toggleTrait(trait)}
              className={`
                flex items-center justify-between px-2 py-2 border transition-all duration-200 rounded-sm
                ${
                  isActive
                    ? 'bg-red-900/20 border-red-900 text-red-800 shadow-[0_0_10px_rgba(220,38,38,0.2)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }
              `}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                {t(`filters.speed.${trait}`)}
              </span>

              {/* Status "LED" */}
              <div
                className={`ml-1 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-red-600 animate-pulse' : 'bg-zinc-800'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

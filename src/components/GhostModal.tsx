import type { Ghost } from '../datas';
import { useTranslation } from 'react-i18next';
import EvidenceIcon from './EvidenceIcon';
import AudioSound from './AudioSound';
import { useFootsteps } from '../hooks/useFootsteps';
import DisplayCategory from './DisplayCategory';

interface GhostModalProps {
  ghost: Ghost;
  huntDuration: number;
  onClose: () => void;
}

export default function GhostModal({
  ghost,
  huntDuration,
  onClose,
}: GhostModalProps) {
  const { t } = useTranslation();
  const { play, stop, isLoaded } = useFootsteps();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#fdfbf7] shadow-2xl border-4 border-[#333] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        <div className="p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-6 text-3xl font-bold hover:text-red-700"
          >
            ×
          </button>

          <div className="flex justify-center items-center">
            <h2 className="text-4xl font-serif uppercase border-b-2 border-black mb-6">
              {t(`ghosts.${ghost.name}.name`)}
            </h2>
            <div className="flex ml-6 mb-6 gap-2">
              {ghost.evidences.map((e, i) => (
                <EvidenceIcon key={i} evidence={e} />
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-6 pt-0 space-y-6 font-mono custom-scrollbar">
          <p className="italic text-gray-700">
            {t(`ghosts.${ghost.name}.description`)}
          </p>

          <DisplayCategory
            isDisplayed={(ghost.uniqueSounds?.length ?? 0) > 0}
            label={t('categories.unique_sounds')}
          >
            {ghost.uniqueSounds &&
              ghost.uniqueSounds.map((sound, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 bg-black/5 p-3 rounded"
                >
                  <span>{t(`unique_sounds.${sound.label}`)}</span>
                  {sound.sounds.map((s, i) => (
                    <AudioSound key={i} {...s} />
                  ))}
                </div>
              ))}
          </DisplayCategory>

          <DisplayCategory
            isDisplayed={ghost.huntDuration !== undefined}
            label={t('categories.hunt_duration')}
          >
            {ghost.huntDuration && (
              <div className="flex flex-col items-stretch bg-gray-100 p-3">
                <span className="text-xs font-bold uppercase">
                  {t(`ghosts.${ghost.name}.hunt_duration_ability`, {
                    seconds: huntDuration * (ghost.huntDuration ?? 1.0),
                  })}
                </span>
              </div>
            )}
          </DisplayCategory>

          <DisplayCategory
            isDisplayed={true}
            label={t('categories.hunt_speed')}
          >
            {ghost.huntSpeeds.map((hs, index) => (
              <div key={index} className="flex items-stretch">
                <div className="flex-1 flex justify-between items-center bg-gray-100 p-3">
                  <span className="text-xs font-bold uppercase">
                    {t(`hunts.${hs.label}`)}
                  </span>
                  <span className="font-mono">{hs.speed} m/s</span>
                </div>

                <button
                  disabled={!isLoaded}
                  onMouseDown={() => play(hs.speed)}
                  onMouseUp={stop}
                  onMouseLeave={stop}
                  className={`p-3 transition-all ${
                    isLoaded
                      ? 'bg-black text-white hover:bg-gray-800 active:bg-green-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoaded ? '🔊' : '...'}
                </button>
              </div>
            ))}
          </DisplayCategory>

          {ghost.huntSpeeds.length > 0 && (
            <p className="text-[10px] text-gray-500 italic text-center">
              {t('hunts.helper')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import type { Ghost } from '../datas';
import { useTranslation } from 'react-i18next';
import EvidenceIcon from './EvidenceIcon';
import AudioSound from './AudioSound';

interface GhostModalProps {
  ghost: Ghost;
  onClose: () => void;
}

export default function GhostModal({ ghost, onClose }: GhostModalProps) {
  const { t } = useTranslation();

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
              {ghost.evidences.map((e) => (
                <EvidenceIcon key={e} evidence={e} />
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-6 pt-0 space-y-6 font-mono custom-scrollbar">
          <p className="italic text-gray-700">
            {t(`ghosts.${ghost.name}.description`)}
          </p>

          {ghost.uniqueSounds && (
            <div className="space-y-4">
              {ghost.uniqueSounds.map((sound) => (
                <div
                  key={sound.label}
                  className="flex flex-col gap-2 bg-black/5 p-3 rounded"
                >
                  <span>{t(`uniqueSound.${sound.label}`)}</span>
                  {sound.sounds.map((s) => (
                    <AudioSound {...s} />
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center bg-gray-100 p-2">
            <span className="uppercase font-bold">Base Speed:</span>
            <span>1.7 m/s</span>
          </div>

          <button
            className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm"
            onClick={() => console.log(`Play sound for ${ghost.name}`)}
          >
            Listen to Footsteps
          </button>
        </div>
      </div>
    </div>
  );
}

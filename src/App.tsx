import { useState } from 'react';
import GhostCard from './components/GhostCard';
import { evidences, ghosts, type Ghost } from './datas';
import GhostModal from './components/GhostModal';
import type { TabType } from './components/FilterTabs';
import FilterTabs from './components/FilterTabs';
import { useTranslation } from 'react-i18next';
import type { EvidenceState } from './components/EvidenceButton';
import EvidenceButton from './components/EvidenceButton';

export default function App() {
  const { t } = useTranslation();
  const [evidenceFilters, setEvidenceFilters] = useState<
    Record<string, EvidenceState>
  >(Object.fromEntries(evidences.map((e) => [e, 'neutral'])));
  const [evidenceCount, setEvidenceCount] = useState<number>(3); // 0 to 3
  const [globalSpeedMult, setGlobalSpeedMult] = useState<number>(100); // Percentage: 50% to 150%
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('evidence');

  const toggleEvidence = (evidence: string) => {
    setEvidenceFilters((prev) => {
      const currentState = prev[evidence];
      let nextState: EvidenceState = 'neutral';

      if (currentState === 'neutral') nextState = 'found';
      else if (currentState === 'found') nextState = 'hidden';
      else nextState = 'neutral';

      return { ...prev, [evidence]: nextState };
    });
  };

  const ghostIsActive = (ghost: Ghost) => {
    const evidencesFound = evidences.filter(
      (e) => evidenceFilters[e] === 'found'
    );
    const evidencesHidden = evidences.filter(
      (e) => evidenceFilters[e] === 'hidden'
    );
    if (evidenceCount === 0) {
      // Only the mimic could have an evidence
      if (evidencesFound.length === 1) {
        return evidencesFound.includes('orb') ? ghost.name === 'mimic' : false;
      } else if (evidencesFound.length > 1) {
        return false;
      }
      return true;
    } else if (evidenceCount === 1) {
      if (evidencesFound.length === 2) {
        return (
          ghost.name === 'mimic' &&
          evidencesFound.filter((e) => ghost.evidences.includes(e)).length ===
            2 &&
          evidencesFound.includes('orb')
        );
      }
      // We found the only evidence here
      else if (evidencesFound.length === 1) {
        if (ghost.strongEvidence !== undefined) {
          // If it has a strong evidence, it should be included in the evidences.
          return evidencesFound.includes(ghost.strongEvidence);
        } else {
          return ghost.evidences.includes(evidencesFound[0]);
        }
      }
      // More than one evidence (except the mimic) should never happen
      else if (evidencesFound.length > 2) {
        return false;
      }
      // If the ghost as a strong evidence and it's hidden, this can't be that ghost then
      if (ghost.strongEvidence !== undefined) {
        return !evidencesHidden.includes(ghost.strongEvidence);
      }
      return true;
    } else if (evidenceCount === 2) {
      const isHidden =
        ghost.evidences.filter((e) => evidencesHidden.includes(e)).length >= 2;
      // Only the mimic could have 3 evidences in a 2 evidences run
      if (evidencesFound.length === 3) {
        return (
          ghost.name === 'mimic' &&
          evidencesFound.filter((e) => ghost.evidences.includes(e)).length ===
            3 &&
          evidencesFound.includes('orb')
        );
      }
      // If we found both evidences, we just need to check for a possible strong evidence
      else if (evidencesFound.length === 2) {
        const hasEvidences =
          evidencesFound.filter((e) => ghost.evidences.includes(e)).length ===
          2;
        if (ghost.strongEvidence !== undefined) {
          return hasEvidences && evidencesFound.includes(ghost.strongEvidence);
        }
        return hasEvidences;
      }
      // One evidence to check
      else if (evidencesFound.length === 1) {
        if (ghost.strongEvidence !== undefined) {
          return (
            ghost.evidences.includes(evidencesFound[0]) &&
            !evidencesHidden.includes(ghost.strongEvidence) &&
            !isHidden
          );
        }
        return ghost.evidences.includes(evidencesFound[0]) && !isHidden;
      }
      // No ghost can have more than 3 evidences obviously
      else if (evidencesFound.length > 3) {
        return false;
      }
      if (ghost.strongEvidence !== undefined) {
        return !evidencesHidden.includes(ghost.strongEvidence) && !isHidden;
      }
      return !isHidden;
    } else {
      if (evidencesFound.length === 4) {
        return (
          ghost.name === 'mimic' &&
          evidencesFound.filter((e) => ghost.evidences.includes(e)).length === 4
        );
      } else if (evidencesFound.length === 3) {
        return (
          ghost.evidences.filter((e) => evidencesFound.includes(e)).length >= 3
        );
      } else if (evidencesFound.length > 4) {
        return false;
      }
      return (
        ghost.evidences.filter((e) => !evidencesHidden.includes(e)).length ===
          ghost.evidences.length &&
        ghost.evidences.filter((e) => evidencesFound.includes(e)).length ===
          evidencesFound.length
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#e8e4d9] py-10 px-4">
      <div className="max-w-4xl mx-auto border-2 border-[#5a5a5a] bg-[#fdfbf7] p-8 shadow-xl min-h-[85vh] flex flex-col">
        <h1 className="text-4xl october_crow text-center mb-8 uppercase tracking-widest border-b-2 border-black pb-4">
          {t('title')}
        </h1>
        <FilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabList={(tab) => {
            switch (tab) {
              case 'evidence':
                return (
                  <div className="grid grid-cols-4 gap-y-1 gap-x-8">
                    {evidences.map((e) => (
                      <EvidenceButton
                        key={e}
                        evidence={e}
                        state={evidenceFilters[e]}
                        onClick={() => toggleEvidence(e)}
                      />
                    ))}
                  </div>
                );
              case 'hunt':
                return (
                  <p className="text-xs font-mono uppercase text-gray-400 italic">
                    Hunting & Speed Comparison Tools
                  </p>
                );
              default:
                return (
                  <div className="grid grid-cols-2 gap-12 font-mono uppercase text-sm">
                    {/* Evidence Count Setting */}
                    <div className="flex flex-col gap-2">
                      <label className="text-center font-bold border-b border-black/10 pb-2">
                        {t('settings.evidence_count')}
                      </label>
                      <div className="flex justify-between items-center gap-2">
                        {[0, 1, 2, 3].map((num) => (
                          <button
                            key={num}
                            onClick={() => setEvidenceCount(num)}
                            className={`flex-1 py-1 border-2 transition-all ${
                              evidenceCount === num
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-gray-200 hover:border-black'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Global Speed Setting */}
                    <div className="flex flex-col gap-2">
                      <label className="text-center font-bold border-b border-black/10 pb-2">
                        {t('settings.ghost_speed')} ({globalSpeedMult}%)
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        step="25"
                        value={globalSpeedMult}
                        onChange={(e) =>
                          setGlobalSpeedMult(Number(e.target.value))
                        }
                        className="w-full accent-black cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                        <span>125%</span>
                        <span>150%</span>
                      </div>
                    </div>
                  </div>
                );
            }
          }}
        />
        <div className="grid grid-cols-3 gap-y-4 gap-x-8">
          {ghosts.map((ghost) => (
            <GhostCard
              key={ghost.name}
              active={ghostIsActive(ghost)}
              ghost={ghost}
              onSelect={() => setSelectedGhost(ghost)}
            />
          ))}
        </div>
      </div>
      {selectedGhost && (
        <GhostModal
          ghost={selectedGhost}
          onClose={() => setSelectedGhost(null)}
        />
      )}
    </main>
  );
}

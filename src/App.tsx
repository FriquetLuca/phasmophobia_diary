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
    const found = evidences.filter((e) => evidenceFilters[e] === 'found');
    const hidden = evidences.filter((e) => evidenceFilters[e] === 'hidden');

    // 1. Global Rule: If we found more evidence than allowed (plus Mimic's Orbs)
    const maxAllowed =
      ghost.name === 'mimic' ? evidenceCount + 1 : evidenceCount;
    if (found.length > maxAllowed) return false;

    // 2. Global Rule: If we found Orbs but the ghost doesn't have Orbs AND isn't a Mimic
    if (
      found.includes('orb') &&
      !ghost.evidences.includes('orb') &&
      ghost.name !== 'mimic'
    )
      return false;

    // 3. Rule Out: If any evidence marked 'hidden' is a REQUIRED evidence for this ghost
    if (ghost.strongEvidence && hidden.includes(ghost.strongEvidence))
      return false;

    // 4. Rule Out: If the number of 'hidden' evidences matches or exceeds
    // what the ghost has left over after the game's limit.
    // Example: In 1-evidence, a ghost has 3 evidences. 2 must be hidden.
    // If we hide 3 of their possible evidences, they are impossible.
    const ghostEvidencesHidden = ghost.evidences.filter((e) =>
      hidden.includes(e)
    ).length;
    const mustBeHiddenCount = 3 - evidenceCount;
    if (ghostEvidencesHidden > mustBeHiddenCount) return false;

    // 5. Found: If we found evidence this ghost doesn't have (and it's not the Mimic/Orb combo)
    const hasIncompatibleFound = found.some((e) => {
      if (e === 'orb' && ghost.name === 'mimic') return false; // Mimic orb exception
      return !ghost.evidences.includes(e);
    });
    if (hasIncompatibleFound) return false;

    // 6. Strong Evidence: If we have found evidence, but it's not the ghost's Strong Evidence
    // (Only applies if we have reached the evidence limit for that ghost)
    if (
      evidenceCount > 0 &&
      ghost.strongEvidence &&
      found.length === evidenceCount
    ) {
      if (!found.includes(ghost.strongEvidence)) return false;
    }

    return true;
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
                        {t('settings.ghost_speed')} (
                        {globalSpeedMult >= 100 ? '' : ' '}
                        {globalSpeedMult}%)
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
          {ghosts
            .sort((left, right) => {
              const leftName = t(`ghosts.${left.name}.name`);
              const rightName = t(`ghosts.${right.name}.name`);
              return leftName.localeCompare(rightName);
            })
            .map((ghost) => (
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

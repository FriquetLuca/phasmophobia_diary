import { useState } from 'react';
import GhostCard from './components/GhostCard';
import {
  evidences,
  getHuntDuration,
  ghosts,
  mapSizeData,
  type Ghost,
  type HuntDurationSetting,
} from './datas';
import GhostModal from './components/GhostModal';
import type { TabType } from './components/FilterTabs';
import FilterTabs from './components/FilterTabs';
import { useTranslation } from 'react-i18next';
import type { EvidenceState } from './components/EvidenceButton';
import EvidenceButton from './components/EvidenceButton';
import DropdownSelect from './components/Dropdown';
type GenderFilter = 'any' | 'male' | 'female';

export default function App() {
  const { t } = useTranslation();

  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);

  const [evidenceFilters, setEvidenceFilters] = useState<
    Record<string, EvidenceState>
  >(Object.fromEntries(evidences.map((e) => [e, 'neutral'])));
  const [evidenceCount, setEvidenceCount] = useState<number>(3); // 0 to 3
  const [globalSpeedMult, setGlobalSpeedMult] = useState<number>(100); // Percentage: 50% to 150%
  const [activeTab, setActiveTab] = useState<TabType>('evidence');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('any');
  const [currentSanity, setCurrentSanity] = useState<number>(0);
  const [selectedMap, setSelectedMap] = useState<string>('6 Tanglewood Drive');
  const [huntSetting, setHuntSetting] = useState<HuntDurationSetting>('medium');

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
  const filterGhostEvidences = (ghost: Ghost) => {
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

  const ghostIsActive = (ghost: Ghost) => {
    if (
      genderFilter !== 'any' &&
      ghost.gender !== undefined &&
      ghost.gender !== genderFilter
    ) {
      return false;
    }
    if (ghost.huntSanity < currentSanity) {
      return false;
    }
    return filterGhostEvidences(ghost);
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
                  <div className="grid grid-cols-2 gap-12 font-mono">
                    {/* Sanity Slider */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-end border-b border-black/10 pb-2">
                        <label className="text-xs font-bold uppercase">
                          {t('hunt.avg_sanity')}
                        </label>
                        <span className="text-sm font-bold font-serif">
                          {currentSanity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={currentSanity}
                        onChange={(e) =>
                          setCurrentSanity(Number(e.target.value))
                        }
                        className="w-full accent-red-700 cursor-pointer"
                      />
                    </div>
                    {/* Gender Dropdown */}
                    <DropdownSelect
                      label={t('hunt.ghost_gender')}
                      value={genderFilter}
                      onChange={(value) =>
                        setGenderFilter(value as GenderFilter)
                      }
                      options={[
                        {
                          label: t('gender.any'),
                          value: 'any',
                        },
                        {
                          label: t('gender.male'),
                          value: 'male',
                        },
                        {
                          label: t('gender.female'),
                          value: 'female',
                        },
                      ]}
                    />
                  </div>
                );
              default:
                return (
                  <div className="grid grid-cols-2 gap-4 font-mono uppercase text-sm">
                    {/* Evidence Count Setting */}
                    <DropdownSelect
                      label={t('settings.evidence_count')}
                      value={evidenceCount}
                      onChange={(value) => setEvidenceCount(Number(value))}
                      options={[
                        {
                          label: '0',
                          value: 0,
                        },
                        {
                          label: '1',
                          value: 1,
                        },
                        {
                          label: '2',
                          value: 2,
                        },
                        {
                          label: '3',
                          value: 3,
                        },
                      ]}
                    />

                    {/* Global Speed Setting */}
                    <DropdownSelect
                      label={t('settings.ghost_speed')}
                      value={globalSpeedMult}
                      onChange={(value) => setGlobalSpeedMult(Number(value))}
                      options={[
                        {
                          label: '50%',
                          value: 50,
                        },
                        {
                          label: '75%',
                          value: 75,
                        },
                        {
                          label: '100%',
                          value: 100,
                        },
                        {
                          label: '125%',
                          value: 125,
                        },
                        {
                          label: '150%',
                          value: 150,
                        },
                      ]}
                    />

                    {/* Map Selection */}
                    <DropdownSelect
                      label={t('settings.map')}
                      value={selectedMap}
                      onChange={(value) => setSelectedMap(value)}
                      options={Object.keys(mapSizeData).map((m) => ({
                        label: m,
                        value: m,
                      }))}
                    />

                    {/* Hunt Duration Setting */}
                    <DropdownSelect
                      label={t('settings.hunt_duration')}
                      value={huntSetting}
                      onChange={(value) =>
                        setHuntSetting(value as HuntDurationSetting)
                      }
                      options={[
                        {
                          label: t('settings.hunt_duration_low'),
                          value: 'low',
                        },
                        {
                          label: t('settings.hunt_duration_medium'),
                          value: 'medium',
                        },
                        {
                          label: t('settings.hunt_duration_high'),
                          value: 'high',
                        },
                      ]}
                    />
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
          ghost={{
            ...selectedGhost,
            huntSpeeds: selectedGhost.huntSpeeds.map((s) => ({
              label: s.label,
              speed:
                Math.floor(s.speed * (globalSpeedMult / 100) * 10000) / 10000,
            })),
          }}
          onClose={() => setSelectedGhost(null)}
          huntDuration={getHuntDuration(huntSetting, selectedMap)}
        />
      )}
    </main>
  );
}

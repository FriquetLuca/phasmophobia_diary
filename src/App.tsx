import { useState } from 'react';
import GhostSelector from './components/GhostSelector';
import {
  onOffActions,
  evidences,
  getHuntDuration,
  ghosts,
  mapSizeData,
  speedTraits,
  type OnOffAction,
  type Ghost,
  type HuntDurationSetting,
  type ModelVisibility,
  type SpeedTrait,
  onOffActionsToggle,
} from './datas';
import GhostModal from './components/GhostModal';
import type { TabType } from './components/FilterTabs';
import FilterTabs from './components/FilterTabs';
import { useTranslation } from 'react-i18next';
import type { EvidenceState } from './components/EvidenceButton';
import EvidenceButton from './components/EvidenceButton';
import DropdownSelect from './components/Dropdown';
import filterGhostEvidences from './filters/filterGhostEvidences';
import Slider from './components/Slider';
import LanguageSwitcher from './components/LanguageSwitcher';
import MultiOptionsSelector from './components/MultiOptionsSelector';
import filterOnOffActions from './filters/filterOnOffActions';
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
  const [ghostSpeedTraits, setGhostSpeedTraits] = useState<SpeedTrait[]>([]);
  const [ghostModelVisibility, setGhostModelVisibility] =
    useState<ModelVisibility>('unknown');
  const [fuseBoxInteractions, setFuseBoxInteractions] = useState<OnOffAction[]>(
    ['unknown']
  );
  const [disturbSaltInteractions, setDisturbSaltInteractions] = useState<
    OnOffAction[]
  >(['unknown']);

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
    if (
      ghostSpeedTraits.length > 0 &&
      !ghostSpeedTraits.reduce(
        (p, c) => p && ghost.huntSpeedTraits.includes(c),
        true
      )
    ) {
      return false;
    }
    if (
      ghostModelVisibility !== 'unknown' &&
      ghostModelVisibility !== ghost.huntModelVisibility
    ) {
      return false;
    }
    if (!filterOnOffActions(fuseBoxInteractions, ghost.breakerInteract)) {
      return false;
    }
    if (!filterOnOffActions(disturbSaltInteractions, ghost.saltInteract)) {
      return false;
    }
    return filterGhostEvidences(
      ghost,
      evidences,
      evidenceFilters,
      evidenceCount
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 py-10 px-4 text-zinc-100">
      <div className="max-w-4xl mx-auto border border-zinc-700 bg-zinc-900 shadow-2xl min-h-[85vh] flex flex-col rounded-lg overflow-hidden">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        <header className="bg-zinc-800/50 p-6 border-b border-zinc-700">
          <h1 className="text-4xl october_crow text-center uppercase tracking-[0.2em] text-white drop-shadow-[0_0_8px_rgba(185,28,28,0.4)]">
            {t('title')}
          </h1>
        </header>
        <FilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabList={(tab) => {
            switch (tab) {
              case 'evidence':
                return (
                  <div className="grid grid-cols-4 gap-y-2 gap-x-2">
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
              case 'interaction':
                return (
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <MultiOptionsSelector
                      label={t('interaction.fuse_box.title')}
                      columns={3}
                      options={onOffActions}
                      selectedOptions={fuseBoxInteractions}
                      toggleOption={onOffActionsToggle(
                        fuseBoxInteractions,
                        setFuseBoxInteractions
                      )}
                      optionLabel={(trait) =>
                        t(`interaction.fuse_box.${trait}`)
                      }
                    />
                    <MultiOptionsSelector
                      label={t('interaction.salt.title')}
                      columns={3}
                      options={onOffActions}
                      selectedOptions={disturbSaltInteractions}
                      toggleOption={onOffActionsToggle(
                        disturbSaltInteractions,
                        setDisturbSaltInteractions
                      )}
                      optionLabel={(trait) => t(`interaction.salt.${trait}`)}
                    />
                  </div>
                );
              case 'hunt':
                return (
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <DropdownSelect
                      label={t('hunt.ghost_gender')}
                      value={genderFilter}
                      onChange={(value) =>
                        setGenderFilter(value as GenderFilter)
                      }
                      options={[
                        {
                          label: t('hunt.gender.any'),
                          value: 'any',
                        },
                        {
                          label: t('hunt.gender.male'),
                          value: 'male',
                        },
                        {
                          label: t('hunt.gender.female'),
                          value: 'female',
                        },
                      ]}
                    />
                    <DropdownSelect
                      label={t('hunt.ghost_visibility')}
                      value={ghostModelVisibility}
                      onChange={(value) =>
                        setGhostModelVisibility(value as ModelVisibility)
                      }
                      options={[
                        {
                          label: t('hunt.visibility_opts.unknown'),
                          value: 'unknown',
                        },
                        {
                          label: t('hunt.visibility_opts.normal'),
                          value: 'normal',
                        },
                        {
                          label: t('hunt.visibility_opts.less_visible'),
                          value: 'lessVisible',
                        },
                        {
                          label: t('hunt.visibility_opts.more_visible'),
                          value: 'moreVisible',
                        },
                        {
                          label: t('hunt.visibility_opts.any'),
                          value: 'any',
                        },
                      ]}
                    />
                    <Slider
                      label={t('hunt.avg_sanity')}
                      value={currentSanity}
                      min="0"
                      max="100"
                      step="1"
                      setValue={(v) => setCurrentSanity(v)}
                      displayValue={(v) => `${v}%`}
                    />
                    <MultiOptionsSelector
                      label={t('hunt.speed.title')}
                      options={speedTraits}
                      selectedOptions={ghostSpeedTraits}
                      toggleOption={(trait) => {
                        if (ghostSpeedTraits.includes(trait)) {
                          setGhostSpeedTraits(
                            ghostSpeedTraits.filter((t) => t !== trait)
                          );
                        } else {
                          setGhostSpeedTraits([...ghostSpeedTraits, trait]);
                        }
                      }}
                      optionLabel={(trait) => t(`hunt.speed.${trait}`)}
                    />
                  </div>
                );
              default:
                return (
                  <div className="grid grid-cols-2 gap-4 font-mono uppercase text-sm">
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
                    <DropdownSelect
                      label={t('settings.map')}
                      value={selectedMap}
                      onChange={(value) => setSelectedMap(value)}
                      options={Object.keys(mapSizeData).map((m) => ({
                        label: m,
                        value: m,
                      }))}
                    />
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
        <div className="grid grid-cols-3">
          {ghosts
            .sort((l, r) =>
              t(`ghosts.${l.name}.name`).localeCompare(
                t(`ghosts.${r.name}.name`)
              )
            )
            .map((ghost) => (
              <GhostSelector
                key={ghost.name}
                active={ghostIsActive(ghost)}
                ghost={ghost}
                name={t(`ghosts.${ghost.name}.name`)}
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
          map={selectedMap}
          onClose={() => setSelectedGhost(null)}
          huntDuration={getHuntDuration(huntSetting, selectedMap)}
        />
      )}
    </main>
  );
}

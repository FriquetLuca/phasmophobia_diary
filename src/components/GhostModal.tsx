import type { Ghost, MapSize } from '../datas';
import { useTranslation } from 'react-i18next';
import AudioSound from './AudioSound';
import { useFootsteps } from '../hooks/useFootsteps';
import DisplayCategory from './DisplayCategory';
import HuntSpeedPlayer from './HuntSpeedPlayer';
import GhostModalTitle from './modal/GhostModalTitle';
import GhostModalContent from './modal/GhostModalContent';
import GhostModalCategory from './modal/GhostModalCategory';
import { MkImp } from 'mkimp_react';

interface GhostModalProps {
  ghost: Ghost;
  huntDuration: number;
  map: string;
  onClose: () => void;
}

export default function GhostModal({
  ghost,
  huntDuration,
  map,
  onClose,
}: GhostModalProps) {
  const { t } = useTranslation();
  const { play, stop, isLoaded } = useFootsteps();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-zinc-700 flex flex-col max-h-[90vh] rounded-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        <div className="h-1 w-full bg-linear-to-r from-red-900 via-red-600 to-red-900" />
        <GhostModalTitle
          title={t(`ghosts.${ghost.name}.name`)}
          evidences={ghost.evidences}
          onClose={onClose}
        />
        <GhostModalContent description={t(`ghosts.${ghost.name}.description`)}>
          <DisplayCategory
            isDisplayed={ghost.hasActivitySpecific ?? false}
            label={t('categories.activity')}
          >
            {ghost.hasActivitySpecific && (
              <GhostModalCategory>
                <MkImp mdContent={t(`ghosts.${ghost.name}.activity`)} />
              </GhostModalCategory>
            )}
          </DisplayCategory>

          <DisplayCategory
            isDisplayed={ghost.hasAbilitiesSpecific ?? false}
            label={t('categories.ability')}
          >
            {ghost.hasAbilitiesSpecific && (
              <GhostModalCategory>
                <MkImp
                  mdContent={t(`ghosts.${ghost.name}.ability`, {
                    distance: ghost.huntAbilityDistance
                      ? ghost.huntAbilityDistance(map as MapSize)
                      : 0,
                  })}
                />
              </GhostModalCategory>
            )}
          </DisplayCategory>

          <DisplayCategory
            isDisplayed={(ghost.uniqueSounds?.length ?? 0) > 0}
            label={t('categories.unique_sounds')}
          >
            {ghost.uniqueSounds && (
              <GhostModalCategory>
                {ghost.uniqueSounds.map((sound, i) => (
                  <div key={i}>
                    <span>{t(`unique_sounds.${sound.label}`)}</span>
                    {sound.sounds.map((s, i) => (
                      <AudioSound key={i} {...s} />
                    ))}
                  </div>
                ))}
              </GhostModalCategory>
            )}
          </DisplayCategory>

          <DisplayCategory
            isDisplayed={ghost.hasHuntAbility ?? false}
            label={t('categories.hunt')}
          >
            {ghost.hasHuntAbility && (
              <GhostModalCategory>
                <MkImp
                  mdContent={t(`ghosts.${ghost.name}.hunt`, {
                    distance: ghost.huntAbilityDistance
                      ? ghost.huntAbilityDistance(map as MapSize)
                      : 0,
                    huntDuration: huntDuration * (ghost.huntDuration ?? 1.0),
                  })}
                />
              </GhostModalCategory>
            )}
          </DisplayCategory>

          <DisplayCategory
            isDisplayed={ghost.hasMiscInfos ?? false}
            label={t('categories.misc')}
          >
            {ghost.hasMiscInfos && (
              <GhostModalCategory>
                <MkImp mdContent={t(`ghosts.${ghost.name}.misc`)} />
              </GhostModalCategory>
            )}
          </DisplayCategory>

          <DisplayCategory
            isDisplayed={ghost.huntSpeeds.length > 0}
            label={t('categories.hunt_speed')}
          >
            {ghost.huntSpeeds.map((hs, index) => (
              <HuntSpeedPlayer
                key={index}
                label={t(`hunts.${hs.label}`)}
                speed={hs.speed}
                isLoaded={isLoaded}
                play={play}
                stop={stop}
              />
            ))}
          </DisplayCategory>

          {ghost.huntSpeeds.length > 0 && (
            <p className="text-[10px] text-gray-500 italic text-center">
              {t('hunts.helper')}
            </p>
          )}
        </GhostModalContent>
      </div>
    </div>
  );
}

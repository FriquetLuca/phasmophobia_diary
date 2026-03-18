export type Evidence =
  | 'dots'
  | 'orb'
  | 'spirit'
  | 'book'
  | 'emf'
  | 'freezing'
  | 'uv';
export const evidences: Evidence[] = [
  'emf',
  'dots',
  'uv',
  'freezing',
  'orb',
  'book',
  'spirit',
];

export type MapSize = 'small' | 'medium' | 'large';

export const mapSizeData: Record<string, MapSize> = {
  '6 Tanglewood Drive': 'small',
  '42 Edgefield Road': 'small',
  '10 Ridgeview Court': 'small',
  "Nell's Diner": 'small',
  'Grafton Farmhouse': 'small',
  '13 Willow Street': 'small',
  'Camp Woodwind': 'small',
  'Point Hope': 'medium',
  'Bleasdale Farmhouse': 'medium',
  'Sunny Meadows Restricted': 'medium',
  Prison: 'medium',
  'Maple Lodge Campsite': 'medium',
  'Brownstone High School': 'large',
  'Sunny Meadows': 'large',
};

export type HuntDurationSetting = 'low' | 'medium' | 'high';

const HUNT_TIMES: Record<HuntDurationSetting, Record<MapSize, number>> = {
  low: { small: 15, medium: 30, large: 40 },
  medium: { small: 20, medium: 40, large: 50 },
  high: { small: 30, medium: 50, large: 60 },
};

export const getHuntDuration = (
  setting: HuntDurationSetting,
  mapName: string
) => {
  const size = mapSizeData[mapName] || 'small';
  return HUNT_TIMES[setting][size];
};
export type ModelVisibility =
  | 'normal'
  | 'lessVisible'
  | 'moreVisible'
  | 'any'
  | 'unknown';
export type SpeedTrait = 'fast' | 'slow' | 'standard' | 'variable';
export type Gender = 'female' | 'male';
export type OnOffAction = 'unknown' | 'on' | 'off';
export interface SoundInterface {
  type: 'audio/mpeg' | 'audio/ogg';
  src: string;
}
export interface UniqueSounds {
  label: string;
  sounds: SoundInterface[];
}
export interface HuntSpeed {
  label: string;
  speed: number;
}

export interface Ghost {
  name: string;
  gender?: Gender;
  evidences: Evidence[];
  strongEvidence?: Evidence;
  uniqueSounds?: UniqueSounds[];
  huntSpeeds: HuntSpeed[];
  huntSanity: number;
  huntDuration?: number;
  hasActivitySpecific?: boolean;
  hasAbilitiesSpecific?: boolean;
  hasHuntAbility?: boolean;
  hasMiscInfos?: boolean;
  huntAbilityDistance?: (mapSize: MapSize) => number;
  huntSpeedTraits: SpeedTrait[];
  huntModelVisibility: ModelVisibility;
  breakerInteract: OnOffAction[];
  saltInteract: OnOffAction[];
}

export const speedTraits: SpeedTrait[] = [
  'standard',
  'variable',
  'fast',
  'slow',
];
export const onOffActions: OnOffAction[] = ['unknown', 'on', 'off'];
export function onOffActionsToggle(
  values: OnOffAction[],
  setValues: (item: OnOffAction[]) => void
) {
  return (newVal: OnOffAction) => {
    const updated = values.includes(newVal)
      ? values.filter((f) => f !== newVal)
      : [...values, newVal];
    if (updated.length === 3) {
      setValues(updated.filter((f) => f !== 'unknown'));
    } else if (updated.length === 0) {
      setValues(['unknown']);
    } else {
      setValues(updated);
    }
  };
}

export const ghosts: Ghost[] = [
  {
    name: 'banshee',
    evidences: ['uv', 'orb', 'dots'],
    gender: 'female',
    uniqueSounds: [
      {
        label: 'banshee_scream',
        sounds: [
          {
            type: 'audio/ogg',
            src: 'banshee_scream_01.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_02.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_03.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_04.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_05.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_06.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_07.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_08.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_09.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_10.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_11.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_12.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_13.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_14.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_15.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_16.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_17.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_18.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_19.ogg',
          },
          {
            type: 'audio/ogg',
            src: 'banshee_scream_20.ogg',
          },
        ],
      },
    ],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    hasMiscInfos: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'dayan',
    evidences: ['emf', 'orb', 'spirit'],
    gender: 'female',
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'dayan_los_top_speed',
        speed: 2.805,
      },
      {
        label: 'close_still_player',
        speed: 1.2,
      },
      {
        label: 'close_moving_player',
        speed: 2.25,
      },
    ],
    huntSanity: 65,
    hasHuntAbility: true,
    hasMiscInfos: true,
    huntSpeedTraits: ['variable', 'standard', 'fast', 'slow'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'demon',
    evidences: ['uv', 'book', 'freezing'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 100,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'deogen',
    strongEvidence: 'spirit',
    evidences: ['spirit', 'book', 'dots'],
    huntSpeeds: [
      {
        label: 'slowest_speed',
        speed: 0.4,
      },
      {
        label: 'top_speed',
        speed: 3,
      },
    ],
    uniqueSounds: [
      {
        label: 'deogen_breath',
        sounds: [
          {
            type: 'audio/mpeg',
            src: 'deogen_breath.mp3',
          },
        ],
      },
    ],
    huntSanity: 40,
    hasHuntAbility: true,
    huntSpeedTraits: ['variable', 'standard', 'fast', 'slow'],
    huntModelVisibility: 'moreVisible',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'gallu',
    evidences: ['emf', 'uv', 'spirit'],
    huntSpeeds: [
      {
        label: 'weakened_speed',
        speed: 1.36,
      },
      {
        label: 'normal_speed',
        speed: 1.7,
      },
      {
        label: 'enraged_speed',
        speed: 1.955,
      },
    ],
    huntSanity: 60,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['variable', 'standard', 'fast', 'slow'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on', 'off'],
  },
  {
    name: 'goryo',
    strongEvidence: 'dots',
    evidences: ['emf', 'uv', 'dots'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'hantu',
    strongEvidence: 'freezing',
    evidences: ['uv', 'orb', 'freezing'],
    huntSpeeds: [
      {
        label: 'above_15c',
        speed: 1.4,
      },
      {
        label: 'between_12_15c',
        speed: 1.75,
      },
      {
        label: 'between_9_12c',
        speed: 2.1,
      },
      {
        label: 'between_6_9c',
        speed: 2.3,
      },
      {
        label: 'between_3_6c',
        speed: 2.4,
      },
      {
        label: 'between_0_3c',
        speed: 2.5,
      },
      {
        label: 'bellow_0c',
        speed: 2.7,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['variable', 'standard', 'fast', 'slow'],
    huntModelVisibility: 'normal',
    breakerInteract: ['off'],
    saltInteract: ['on'],
  },
  {
    name: 'jinn',
    evidences: ['emf', 'uv', 'freezing'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'fixed_ability_speed',
        speed: 2.5,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['variable', 'standard', 'fast'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on'],
    saltInteract: ['on'],
  },
  {
    name: 'mare',
    evidences: ['spirit', 'orb', 'book'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'moroi',
    strongEvidence: 'spirit',
    evidences: ['spirit', 'book', 'freezing'],
    huntSpeeds: [
      {
        label: 'above_45_sanity',
        speed: 1.5,
      },
      {
        label: 'between_40_45_sanity',
        speed: 1.583,
      },
      {
        label: 'between_35_40_sanity',
        speed: 1.66,
      },
      {
        label: 'between_30_35_sanity',
        speed: 1.749,
      },
      {
        label: 'between_25_30_sanity',
        speed: 1.832,
      },
      {
        label: 'between_20_25_sanity',
        speed: 1.915,
      },
      {
        label: 'between_15_20_sanity',
        speed: 1.998,
      },
      {
        label: 'between_10_15_sanity',
        speed: 2.081,
      },
      {
        label: 'between_5_10_sanity',
        speed: 2.164,
      },
      {
        label: 'between_0_5_sanity',
        speed: 2.25,
      },
      {
        label: 'los_top_speed',
        speed: 3.7125,
      },
    ],
    huntSanity: 50,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['variable', 'standard', 'fast', 'slow'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'myling',
    evidences: ['emf', 'uv', 'book'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'obake',
    strongEvidence: 'uv',
    evidences: ['emf', 'uv', 'orb'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'obambo',
    evidences: ['book', 'uv', 'dots'],
    huntSpeeds: [
      {
        label: 'calm_state',
        speed: 1.445,
      },
      {
        label: 'aggressive_state',
        speed: 1.955,
      },
      {
        label: 'calm_los_top_speed',
        speed: 2.38425,
      },
      {
        label: 'aggressive_los_top_speed',
        speed: 3.22575,
      },
    ],
    huntSanity: 65,
    hasActivitySpecific: true,
    hasHuntAbility: true,
    huntDuration: 0.8,
    huntSpeedTraits: ['variable', 'fast', 'slow'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'oni',
    evidences: ['emf', 'freezing', 'dots'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    uniqueSounds: [
      {
        label: 'air_breath',
        sounds: [
          {
            type: 'audio/mpeg',
            src: 'air_breath.mp3',
          },
        ],
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'moreVisible',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'onryo',
    evidences: ['spirit', 'orb', 'freezing'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 60,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'phantom',
    evidences: ['spirit', 'uv', 'dots'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'lessVisible',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'poltergeist',
    evidences: ['spirit', 'book', 'uv'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'raiju',
    evidences: ['emf', 'orb', 'dots'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'fixed_ability_speed',
        speed: 2.5,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 65,
    hasActivitySpecific: true,
    hasHuntAbility: true,
    hasMiscInfos: true,
    huntAbilityDistance: (dist) => {
      switch (dist) {
        case 'large':
          return 10;
        case 'medium':
          return 8;
        default:
          return 6;
      }
    },
    huntSpeedTraits: ['variable', 'standard', 'fast'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'revenant',
    evidences: ['orb', 'book', 'freezing'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1,
      },
      {
        label: 'chasing_speed',
        speed: 3,
      },
    ],
    huntSanity: 50,
    hasHuntAbility: true,
    huntSpeedTraits: ['variable', 'fast', 'slow'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'shade',
    evidences: ['emf', 'book', 'freezing'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 35,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'spirit',
    evidences: ['emf', 'spirit', 'book'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'thaye',
    evidences: ['orb', 'book', 'dots'],
    huntSpeeds: [
      {
        label: 'age_0_speed',
        speed: 2.75,
      },
      {
        label: 'age_1_speed',
        speed: 2.575,
      },
      {
        label: 'age_2_speed',
        speed: 2.4,
      },
      {
        label: 'age_3_speed',
        speed: 2.225,
      },
      {
        label: 'age_4_speed',
        speed: 2.05,
      },
      {
        label: 'age_5_speed',
        speed: 1.875,
      },
      {
        label: 'age_6_speed',
        speed: 1.7,
      },
      {
        label: 'age_7_speed',
        speed: 1.525,
      },
      {
        label: 'age_8_speed',
        speed: 1.35,
      },
      {
        label: 'age_9_speed',
        speed: 1.175,
      },
      {
        label: 'age_10_speed',
        speed: 1,
      },
    ],
    huntSanity: 75,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['variable', 'standard', 'fast', 'slow'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'mimic',
    strongEvidence: 'orb',
    evidences: ['spirit', 'uv', 'freezing', 'orb'],
    huntSpeeds: [],
    huntSanity: 100,
    hasAbilitiesSpecific: true,
    huntSpeedTraits: ['variable', 'standard', 'fast', 'slow'],
    huntModelVisibility: 'any',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'twins',
    evidences: ['emf', 'spirit', 'freezing'],
    huntSpeeds: [
      {
        label: 'slow_twin',
        speed: 1.5,
      },
      {
        label: 'fast_twin',
        speed: 1.9,
      },
      {
        label: 'slow_twin_los_top_speed',
        speed: 2.475,
      },
      {
        label: 'fast_twin_los_top_speed',
        speed: 3.135,
      },
    ],
    huntSanity: 50,
    hasAbilitiesSpecific: true,
    hasHuntAbility: true,
    huntAbilityDistance: (dist) => {
      switch (dist) {
        case 'large':
          return 4.24;
        case 'medium':
        default:
          return 2.12;
      }
    },
    huntSpeedTraits: ['variable', 'fast', 'slow'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'wraith',
    evidences: ['emf', 'spirit', 'dots'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['off'],
  },
  {
    name: 'yokai',
    evidences: ['spirit', 'orb', 'dots'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 80,
    hasActivitySpecific: true,
    hasHuntAbility: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
  {
    name: 'yurei',
    evidences: ['orb', 'freezing', 'dots'],
    huntSpeeds: [
      {
        label: 'base_speed',
        speed: 1.7,
      },
      {
        label: 'los_top_speed',
        speed: 2.805,
      },
    ],
    huntSanity: 50,
    hasActivitySpecific: true,
    hasAbilitiesSpecific: true,
    huntSpeedTraits: ['standard'],
    huntModelVisibility: 'normal',
    breakerInteract: ['on', 'off'],
    saltInteract: ['on'],
  },
];

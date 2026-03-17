import type { SoundInterface } from '../datas';

export default function AudioSound(soundInterface: SoundInterface) {
  return (
    <audio controls>
      <source src={`/audio/${soundInterface.src}`} type={soundInterface.type} />
    </audio>
  );
}

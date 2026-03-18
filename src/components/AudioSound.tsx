import type { SoundInterface } from '../datas';
import { urlPrefix } from '../urlPrefix';

export default function AudioSound(soundInterface: SoundInterface) {
  return (
    <audio controls>
      <source
        src={urlPrefix(`/audio/${soundInterface.src}`)}
        type={soundInterface.type}
      />
    </audio>
  );
}

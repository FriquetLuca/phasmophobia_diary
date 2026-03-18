import type { OnOffAction } from '../datas';

export default function filterOnOffActions(
  fuseBoxInteractions: OnOffAction[],
  ghostInteractions: OnOffAction[]
) {
  const observedInteractions = fuseBoxInteractions.filter(
    (f) => f !== 'unknown'
  );
  const matchesBreaker =
    observedInteractions.length === 0 ||
    observedInteractions.every((val) => ghostInteractions.includes(val));
  if (!matchesBreaker) {
    return false;
  }
  return true;
}

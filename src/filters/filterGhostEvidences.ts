import type { EvidenceState } from '../components/EvidenceButton';
import type { Evidence, Ghost } from '../datas';

export default function filterGhostEvidences(
  ghost: Ghost,
  evidences: Evidence[],
  evidenceFilters: Record<string, EvidenceState>,
  evidenceCount: number
) {
  const found = evidences.filter((e) => evidenceFilters[e] === 'found');
  const hidden = evidences.filter((e) => evidenceFilters[e] === 'hidden');

  // 1. Global Rule: If we found more evidence than allowed (plus Mimic's Orbs)
  const maxAllowed = ghost.name === 'mimic' ? evidenceCount + 1 : evidenceCount;
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
}

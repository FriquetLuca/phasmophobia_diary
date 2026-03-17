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

  return (
    <main className="min-h-screen bg-[#e8e4d9] py-10 px-4">
      <div className="max-w-4xl mx-auto border-2 border-[#5a5a5a] bg-[#fdfbf7] p-8 shadow-xl min-h-[85vh] flex flex-col">
        <h1 className="text-4xl font-serif text-center mb-8 uppercase tracking-widest border-b-2 border-black pb-4">
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
                  <p className="text-xs font-mono uppercase text-gray-400 italic">
                    Language & Audio Settings
                  </p>
                );
            }
          }}
        />
        <div className="grid grid-cols-3 gap-y-4 gap-x-8">
          {ghosts.map((ghost) => (
            <GhostCard
              key={ghost.name}
              active={true} // You'll change this to a dynamic filter check soon
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

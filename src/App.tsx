import { useState } from 'react';
import GhostCard from './components/GhostCard';
import { ghosts, type Ghost } from './datas';
import GhostModal from './components/GhostModal';

export default function App() {
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);

  return (
    <main className="min-h-screen bg-[#e8e4d9] py-10 px-4">
      <div className="max-w-4xl mx-auto border-2 border-[#5a5a5a] bg-[#fdfbf7] p-8 shadow-xl min-h-[80vh]">
        <h1 className="text-4xl font-serif text-center mb-12 uppercase tracking-widest border-b-2 border-black pb-4">
          Evidence Journal
        </h1>

        {/* The 3-column grid */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-8">
          {ghosts.map((ghost) => (
            <GhostCard
              key={ghost.name}
              active={true}
              ghost={ghost}
              onSelect={() => setSelectedGhost(ghost)}
            />
          ))}
        </div>
      </div>

      {/* Render modal if a ghost is selected */}
      {selectedGhost && (
        <GhostModal
          ghost={selectedGhost}
          onClose={() => setSelectedGhost(null)}
        />
      )}
    </main>
  );
}

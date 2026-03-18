interface GhostModalContentProps {
  description: string;
  children: React.ReactNode;
}

export default function GhostModalContent({
  description,
  children,
}: GhostModalContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
      <div className="relative p-4 bg-zinc-800/30 border-l-2 border-zinc-600 italic text-zinc-400 font-serif text-lg leading-relaxed">
        <q className="before:content-open after:content-close cmu_serif">
          {description}
        </q>
      </div>
      <div className="grid grid-cols-1 gap-4">{children}</div>
    </div>
  );
}

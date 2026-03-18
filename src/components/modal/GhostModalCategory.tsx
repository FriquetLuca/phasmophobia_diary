interface GhostModalCategoryProps {
  children: React.ReactNode;
}

export default function GhostModalCategory({
  children,
}: GhostModalCategoryProps) {
  return (
    <div className="relative group overflow-hidden">
      <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-sm transition-all duration-300 group-hover:border-zinc-700 group-hover:bg-zinc-900/80">
        <pre className="text-base font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap wrap-break-word">
          <code className="selection:bg-red-900/50 selection:text-red-100 cmu_serif">
            {children}
          </code>
        </pre>
      </div>

      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700 group-hover:border-red-600 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700 group-hover:border-red-600 transition-colors" />
    </div>
  );
}

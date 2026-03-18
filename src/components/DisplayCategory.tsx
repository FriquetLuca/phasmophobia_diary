interface DisplayCategoryProps {
  isDisplayed: boolean;
  label: string;
  children: React.ReactNode;
}

export default function DisplayCategory({
  isDisplayed,
  label,
  children,
}: DisplayCategoryProps) {
  if (!isDisplayed) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-px w-4 bg-red-600/50" />
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </h3>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>
      <div className="pl-6 flex flex-col gap-2">{children}</div>
    </div>
  );
}

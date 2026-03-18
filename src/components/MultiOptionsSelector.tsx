import FilterButton from './FilterButton';

interface MultiOptionsSelectorProps<T> {
  label: string;
  options: T[];
  selectedOptions: T[];
  toggleOption: (option: T) => void;
  optionLabel: (option: T) => string;
  columns?: 1 | 2 | 3;
}

export default function MultiOptionsSelector<T>({
  label,
  options,
  selectedOptions,
  toggleOption,
  optionLabel,
  columns = 2,
}: MultiOptionsSelectorProps<T>) {
  const gridCols =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-2'
        : 'grid-cols-3';
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </span>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>

      <div className={`grid ${gridCols} gap-1`}>
        {options.map((option, i) => {
          return (
            <FilterButton
              key={i}
              isActive={selectedOptions.includes(option)}
              label={optionLabel(option)}
              onClick={() => toggleOption(option)}
            />
          );
        })}
      </div>
    </div>
  );
}

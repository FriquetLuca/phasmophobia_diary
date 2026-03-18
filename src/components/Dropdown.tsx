type DropdownValue = string | number | readonly string[] | undefined;

interface DropdownSelectOption {
  label: string;
  value: DropdownValue;
}

interface DropdownSelectProps<T extends DropdownValue> {
  label: string;
  value: T;
  onChange: (value: string) => void;
  options: DropdownSelectOption[];
}

export default function DropdownSelect<T extends DropdownValue>({
  label,
  value,
  onChange,
  options,
}: DropdownSelectProps<T>) {
  return (
    <div className="flex items-center justify-between gap-2 group w-full border-b border-zinc-800/50">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">
        {label}
      </label>
      <div className="relative flex items-center min-w-35">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ colorScheme: 'dark' }}
          className="
            w-full bg-zinc-900/80 border border-zinc-700 
            text-zinc-100 font-mono text-sm uppercase tracking-wider
            pl-3 pr-8 py-1 outline-none cursor-pointer
            appearance-none hover:bg-zinc-800 hover:border-zinc-500
            transition-all rounded-sm
          "
        >
          {options.map((o, i) => (
            <option
              key={i}
              value={o.value}
              className="bg-zinc-900 text-zinc-100"
            >
              {o.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-[8px] text-zinc-500 group-hover:text-red-500 transition-colors">
          ▼
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex justify-between items-center gap-2">
      <label className="font-bold py-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-black/10 px-1 py-1 outline-none font-serif text-base"
      >
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

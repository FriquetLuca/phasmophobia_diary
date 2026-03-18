interface SliderProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  displayValue?: (value: number) => React.ReactNode;
  min?: string | number | undefined;
  max?: string | number | undefined;
  step?: string | number | undefined;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  setValue,
  displayValue,
}: SliderProps) {
  const valueDisplayed = displayValue ? (
    <span className="text-lg font-mono font-bold text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">
      {displayValue(value)}
    </span>
  ) : null;

  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex justify-between items-center border-b border-zinc-700 pb-1">
        <label className="text-[10px] mr-1 font-bold uppercase tracking-widest text-zinc-500 transition-colors">
          {label}
        </label>
        {valueDisplayed}
      </div>

      <div className="relative flex items-center h-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="
                        w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer
                        accent-red-600
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-2
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:bg-red-600
                        [&::-webkit-slider-thumb]:border-x-2
                        [&::-webkit-slider-thumb]:border-zinc-950
                        [&::-webkit-slider-thumb]:hover:bg-red-500
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-moz-range-thumb]:w-2
                        [&::-moz-range-thumb]:h-3
                        [&::-moz-range-thumb]:bg-red-600
                        [&::-moz-range-thumb]:border-none
                        [&::-moz-range-thumb]:rounded-none
                    "
        />
      </div>
    </div>
  );
}

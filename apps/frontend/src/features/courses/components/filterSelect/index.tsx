import { ChevronDown } from "lucide-react";

type FilterSelectProps<T extends string> = {
  value: T | "";
  onChange: (value: T | "") => void;
  placeholder: string;
  options: ReadonlyArray<{ value: T; label: string }>;
};

export default function FilterSelect<T extends string>({
  value,
  onChange,
  placeholder,
  options,
}: FilterSelectProps<T>) {
  return (
    <div className="relative">
      <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7F7C]" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T | "")}
        className="h-[46px] min-w-[132px] appearance-none rounded-[10px] border border-[#E6E6E0] bg-white px-4 pl-10 text-sm font-medium text-[#1F2525] outline-none transition-all duration-300 hover:border-[#D7DED8] focus:border-[#6F9278]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

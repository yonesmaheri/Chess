import { cn } from "@/shared/lib/utils";

type SettingToggleProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

export default function SettingToggle({
  active,
  label,
  onClick,
}: SettingToggleProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-between rounded-[16px] border px-3 py-2 text-sm transition",
        active
          ? "border-[#CFE3CF] bg-[#EEF8EE] text-[#2F8A4E]"
          : "border-[#E5EAE2] bg-white text-[#5D675E]",
      )}
      onClick={onClick}
    >
      <span>{label}</span>
      <span
        className={cn(
          "inline-flex h-6 w-11 rounded-full p-1 transition",
          active ? "bg-[#7F9F85]" : "bg-[#D9DED8]",
        )}
      >
        <span
          className={cn(
            "size-4 rounded-full bg-white transition",
            active ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}

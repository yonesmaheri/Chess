type EvaluationBarProps = {
  value: string;
};

export default function EvaluationBar({ value }: EvaluationBarProps) {
  return (
    <div className="rounded-[18px] border border-[#E5EAE2] bg-white px-3 py-2 shadow-[0_10px_20px_rgba(31,37,37,0.03)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#6E7772]">ارزیابی</span>
        <span className="text-sm font-black text-[#35553D]">{value}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EEF2EC]">
        <div
          className="h-full rounded-full bg-[#7F9F85]"
          style={{ width: "56%" }}
        />
      </div>
    </div>
  );
}

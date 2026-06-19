const boardSquares = Array.from({ length: 64 });

export default function ChessBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,248,245,0.92),rgba(255,255,255,1))]" />

      <div className="absolute left-1/2 top-1/2 grid w-[min(92vw,980px)] -translate-x-1/2 -translate-y-1/2 grid-cols-8 gap-1 opacity-[0.06]">
        {boardSquares.map((_, index) => (
          <span
            key={index}
            className={
              index % 2 === Math.floor(index / 8) % 2
                ? "aspect-square rounded-[6px] bg-[var(--landing-primary)]"
                : "aspect-square rounded-[6px] bg-[var(--landing-border)]"
            }
          />
        ))}
      </div>

      <span className="absolute left-[7%] top-[18%] text-[160px] leading-none text-[var(--landing-text)] opacity-[0.05] blur-[2px]">
        ♞
      </span>
      <span className="absolute right-[10%] top-[22%] text-[136px] leading-none text-[var(--landing-text)] opacity-[0.05] blur-[2px]">
        ♟
      </span>
      <span className="absolute bottom-[7%] left-1/2 -translate-x-1/2 text-[150px] leading-none text-[var(--landing-text)] opacity-[0.04] blur-[2px]">
        ♜
      </span>

      <div className="absolute left-[10%] top-[12%] size-56 rounded-full bg-[rgba(198,154,66,0.08)] blur-3xl" />
      <div className="absolute bottom-[12%] right-[14%] size-64 rounded-full bg-[rgba(72,101,84,0.12)] blur-3xl" />
    </div>
  );
}

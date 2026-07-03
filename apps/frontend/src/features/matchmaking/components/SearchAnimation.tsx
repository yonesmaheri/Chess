import "./search-animation.css";

interface SearchAnimationProps {
  isPaused?: boolean;
}

export function SearchAnimation({ isPaused = false }: SearchAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className={`search-animation ${isPaused ? "paused" : ""}`}>
        <div className="search-radar"></div>
        <div className="search-knight">♘</div>
      </div>
    </div>
  );
}

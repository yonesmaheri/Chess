export const PROMOTION_OPTIONS = [
  { value: "q", label: "وزیر", symbol: "Q" },
  { value: "r", label: "رخ", symbol: "R" },
  { value: "b", label: "فیل", symbol: "B" },
  { value: "n", label: "اسب", symbol: "N" },
] as const;

export type PromotionPiece = (typeof PROMOTION_OPTIONS)[number]["value"];

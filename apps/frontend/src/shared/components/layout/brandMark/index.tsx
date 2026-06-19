import Link from "next/link";
import { Crown } from "lucide-react";

export default function BrandMark() {
  return (
    <Link href="#top" className="flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f6d5c,#3f584a)] text-white shadow-[0_16px_40px_rgba(72,101,84,0.25)]">
        <Crown className="size-5" />
      </span>
      <span className="flex flex-col items-start">
        <span className="text-lg font-extrabold text-[var(--landing-text)]">
          Chess.ir
        </span>
        <span className="text-xs text-[var(--landing-muted)]">
          پلتفرم آموزش و بازی شطرنج
        </span>
      </span>
    </Link>
  );
}

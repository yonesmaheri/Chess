import { Crown, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";

interface PlayerCardProps {
  name: string;
  rating?: number;
  country?: string;
  status?: "searching" | "matched" | "online";
  isAnimating?: boolean;
}

export function PlayerCard({
  name,
  rating,
  country,
  status = "searching",
  isAnimating = false,
}: PlayerCardProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-[20px] border border-[#E5EAE2] bg-white px-6 py-6 shadow-[0_24px_60px_rgba(31,37,37,0.06)] transition-all duration-500 ${
        isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-50"
      }`}
    >
      <div className="relative">
        <Avatar className="size-20 border-2 border-[#E4EAE1] bg-[#F7FAF6]">
          <AvatarFallback className="bg-[#EEF4EC] text-lg font-bold text-[#648162]">
            {initials}
          </AvatarFallback>
        </Avatar>
        {status === "online" && (
          <div className="absolute bottom-0 right-0 size-4 rounded-full bg-[#7F9F85] border-2 border-white"></div>
        )}
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-[#1F2525]">{name}</h3>
        {status === "searching" && (
          <p className="mt-1 text-sm text-[#7F9F85] font-medium">جستجو...</p>
        )}
        {status === "matched" && (
          <p className="mt-1 text-sm text-[#5E9F5E] font-medium">
            حریف یافت شد
          </p>
        )}
      </div>

      {rating !== undefined && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F0F4EE] border border-[#E0E8DC]">
          <Crown className="size-4 text-[#7F9F85]" />
          <span className="text-sm font-semibold text-[#1F2525]">{rating}</span>
        </div>
      )}

      {country && (
        <div className="flex items-center gap-2 text-sm text-[#6E7772]">
          <MapPin className="size-4" />
          <span>{country}</span>
        </div>
      )}
    </div>
  );
}

import { Flag, Handshake, RotateCcw, Settings2, Undo2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import type {
  GameRoomRequestType,
  GameRoomSettingKey,
  GameRoomSettings,
} from "../../types";
import SettingToggle from "../settingToggle";

type BoardToolbarProps = {
  isPlayerTurn: boolean;
  onFlipBoard: () => void;
  onOfferDraw: () => void;
  onRequestUndo: () => void;
  onResign: () => void;
  onToggleSetting: (key: GameRoomSettingKey) => void;
  outgoingRequest: GameRoomRequestType | null;
  settings: GameRoomSettings;
};

export default function BoardToolbar({
  isPlayerTurn,
  onFlipBoard,
  onOfferDraw,
  onRequestUndo,
  onResign,
  onToggleSetting,
  outgoingRequest,
  settings,
}: BoardToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[14px] border-[#DCE4D9] bg-white px-3 text-[#4C5A4F]"
        onClick={onOfferDraw}
      >
        <Handshake className="size-4" />
        {outgoingRequest === "draw" ? "در انتظار" : "تساوی"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[14px] border-[#DCE4D9] bg-white px-3 text-[#4C5A4F]"
        onClick={onRequestUndo}
      >
        <Undo2 className="size-4" />
        {outgoingRequest === "undo" ? "در انتظار" : "بازگشت"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[14px] border-[#DCE4D9] bg-white px-3 text-[#4C5A4F]"
        onClick={onFlipBoard}
      >
        <RotateCcw className="size-4" />
        چرخش
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-[14px] border-[#DCE4D9] bg-white px-3 text-[#4C5A4F]"
          >
            <Settings2 className="size-4" />
            تنظیمات
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 rounded-[20px] border border-[#E5EAE2] bg-white p-3">
          <PopoverHeader className="mb-2">
            <PopoverTitle className="text-right font-bold text-[#1F2525]">
              تنظیمات بازی
            </PopoverTitle>
          </PopoverHeader>
          <div className="grid gap-2">
            <SettingToggle
              active={settings.showCoordinates}
              label="نمایش مختصات"
              onClick={() => onToggleSetting("showCoordinates")}
            />
            <SettingToggle
              active={settings.showLegalMoves}
              label="هایلایت حرکت‌های مجاز"
              onClick={() => onToggleSetting("showLegalMoves")}
            />
            <SettingToggle
              active={settings.enableAnimations}
              label="انیمیشن مهره‌ها"
              onClick={() => onToggleSetting("enableAnimations")}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[14px] border-[#F0D0CF] bg-[#FFF7F7] px-3 text-[#B24B46]"
        onClick={onResign}
      >
        <Flag className="size-4" />
        تسلیم
      </Button>
      <Badge
        className={cn(
          "h-10 px-3 text-sm",
          isPlayerTurn
            ? "bg-[#E8F6EA] text-[#2F8A4E]"
            : "bg-[#F4F5F2] text-[#6E7772]",
        )}
      >
        {isPlayerTurn ? "حرکت شما" : "در انتظار حریف"}
      </Badge>
    </div>
  );
}

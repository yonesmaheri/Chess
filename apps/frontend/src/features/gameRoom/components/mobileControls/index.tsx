import { Flag, Handshake, RotateCcw, Settings2, Undo2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/shared/components/ui/popover";
import type { GameRoomRequestType, GameRoomSettingKey, GameRoomSettings } from "../../types";
import SettingToggle from "../settingToggle";

type MobileControlsProps = {
  onFlipBoard: () => void;
  onOfferDraw: () => void;
  onRequestUndo: () => void;
  onResign: () => void;
  onToggleSetting: (key: GameRoomSettingKey) => void;
  outgoingRequest: GameRoomRequestType | null;
  settings: GameRoomSettings;
};

export default function MobileControls({
  onFlipBoard,
  onOfferDraw,
  onRequestUndo,
  onResign,
  onToggleSetting,
  outgoingRequest,
  settings,
}: MobileControlsProps) {
  return (
    <section className="rounded-[24px] border border-[#E5EAE2] bg-white p-3 shadow-[0_18px_40px_rgba(31,37,37,0.04)]">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]"
          onClick={onOfferDraw}
        >
          <Handshake className="size-4" />
          {outgoingRequest === "draw" ? "در انتظار..." : "تساوی"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-[16px] border-[#F0D0CF] bg-[#FFF7F7] text-[#B24B46]"
          onClick={onResign}
        >
          <Flag className="size-4" />
          تسلیم
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]"
          onClick={onRequestUndo}
        >
          <Undo2 className="size-4" />
          {outgoingRequest === "undo" ? "در انتظار..." : "بازگشت"}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]"
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
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-[16px] border-[#DCE4D9] bg-white text-[#4C5A4F]"
                onClick={onFlipBoard}
              >
                <RotateCcw className="size-4" />
                چرخش صفحه
              </Button>
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
      </div>
    </section>
  );
}

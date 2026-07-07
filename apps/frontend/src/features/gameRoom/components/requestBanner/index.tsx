import { Button } from "@/shared/components/ui/button";
import type { GameRoomRequestType } from "../../types";

type RequestBannerProps = {
  requestType: GameRoomRequestType;
  onAccept: () => void;
  onReject: () => void;
};

export default function RequestBanner({
  requestType,
  onAccept,
  onReject,
}: RequestBannerProps) {
  return (
    <div className="rounded-[20px] border border-[#E9D9AF] bg-[#FFF9E8] p-3">
      <p className="text-sm font-bold text-[#805B15]">
        {requestType === "draw"
          ? "درخواست تساوی دریافت شد."
          : "درخواست بازگشت آخرین حرکت دریافت شد."}
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          className="h-10 flex-1 rounded-[14px] bg-[#7F9F85] text-white hover:bg-[#6E8F74]"
          onClick={onAccept}
        >
          تایید
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 flex-1 rounded-[14px] border-[#E6D7AA] bg-white text-[#7B632A]"
          onClick={onReject}
        >
          رد
        </Button>
      </div>
    </div>
  );
}

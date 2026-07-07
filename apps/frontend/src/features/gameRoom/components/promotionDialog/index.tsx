import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { PROMOTION_OPTIONS, type PromotionPiece } from "../../lib/constants";

type PromotionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (piece: PromotionPiece) => void;
};

export default function PromotionDialog({
  isOpen,
  onClose,
  onSelect,
}: PromotionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm rounded-[24px] border border-[#E5EAE2] bg-white p-5"
      >
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-black text-[#1F2525]">
            انتخاب مهره برای ترفیع
          </DialogTitle>
          <DialogDescription className="leading-7 text-[#6E7772]">
            مهره‌ای را انتخاب کنید که پیاده به آن تبدیل شود.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {PROMOTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className="rounded-[18px] border border-[#DCE4D9] bg-[#F8FAF7] px-4 py-4 text-center transition hover:border-[#BFD0BD] hover:bg-[#EEF5EC]"
              onClick={() => onSelect(option.value)}
            >
              <div className="text-3xl font-black text-[#2F4031]">
                {option.symbol}
              </div>
              <div className="mt-2 text-sm font-medium text-[#5D675E]">
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { cn } from "@/shared/lib/utils";
import type { GameRoomChatMessage } from "../../types";

type ChatMessageBubbleProps = {
  message: GameRoomChatMessage;
};

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  if (message.author === "system") {
    return (
      <div className="rounded-[16px] border border-dashed border-[#DCE4D9] bg-[#FAFCF9] px-3 py-2 text-center text-xs text-[#6E7772]">
        <p>{message.text}</p>
        <span className="mt-1 block text-[11px] text-[#A0AAA1]">
          {message.timestamp}
        </span>
      </div>
    );
  }

  const isPlayer = message.author === "player";

  return (
    <div className={cn("flex", isPlayer ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[86%] rounded-[20px] px-4 py-3 shadow-[0_8px_18px_rgba(31,37,37,0.03)]",
          isPlayer
            ? "bg-[#E8F4E8] text-[#29472F]"
            : "bg-[#F2F5F0] text-[#1F2525]",
        )}
      >
        <p className="text-sm leading-6">{message.text}</p>
        <span className="mt-1 block text-[11px] text-[#8B938C]">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

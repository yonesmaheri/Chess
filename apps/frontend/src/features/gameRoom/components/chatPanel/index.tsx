import { SendHorizontal } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import type { GameRoomChatMessage } from "../../types";
import ChatMessageBubble from "../chatMessageBubble";

type ChatPanelProps = {
  chatDraft: string;
  chatMessages: GameRoomChatMessage[];
  isOpponentTyping: boolean;
  messageListRef: RefObject<HTMLDivElement | null>;
  onDraftChange: (value: string) => void;
  onSendMessage: () => void;
  padded: boolean;
};

export default function ChatPanel({
  chatDraft,
  chatMessages,
  isOpponentTyping,
  messageListRef,
  onDraftChange,
  onSendMessage,
  padded,
}: ChatPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={messageListRef}
        className={cn(
          "min-h-0 flex-1 space-y-3 overflow-y-auto",
          padded ? "px-4 py-4" : "px-4 py-4",
        )}
      >
        {chatMessages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        {isOpponentTyping ? (
          <div className="flex justify-start">
            <div className="rounded-[18px] bg-[#F2F5F0] px-4 py-2 text-sm text-[#6E7772]">
              حریف درحال تایپ است...
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[#EEF2EC] p-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="پیام خود را بنویسید"
            className="h-11 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] px-4 text-right"
            placeholder="پیام خود را بنویسید..."
            value={chatDraft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button
            type="button"
            className="size-11 rounded-[16px] bg-[#7F9F85] text-white hover:bg-[#6E8F74]"
            onClick={onSendMessage}
            aria-label="ارسال پیام"
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

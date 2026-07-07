import type { RefObject } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import type { GameRoomChatMessage, GameRoomMovePair } from "../../types";
import ChatPanel from "../chatPanel";
import MovePill from "../movePill";

type MobileAccordionsValue = "moves" | "chat" | undefined;

type MobileAccordionsProps = {
  chatDraft: string;
  chatMessages: GameRoomChatMessage[];
  currentMoveIndex: number;
  isOpponentTyping: boolean;
  messageListRef: RefObject<HTMLDivElement | null>;
  movePairs: GameRoomMovePair[];
  onChatDraftChange: (value: string) => void;
  onSendMessage: () => void;
  onValueChange: (value: MobileAccordionsValue) => void;
  unreadCount: number;
  value: MobileAccordionsValue;
};

export default function MobileAccordions({
  chatDraft,
  chatMessages,
  currentMoveIndex,
  isOpponentTyping,
  messageListRef,
  movePairs,
  onChatDraftChange,
  onSendMessage,
  onValueChange,
  unreadCount,
  value,
}: MobileAccordionsProps) {
  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={(nextValue) =>
        onValueChange((nextValue || undefined) as MobileAccordionsValue)
      }
      className="rounded-[24px] border border-[#E5EAE2] bg-white px-3 py-1 shadow-[0_18px_40px_rgba(31,37,37,0.04)]"
    >
      <AccordionItem value="moves" className="border-0">
        <AccordionContent className="pt-0 pb-3">
          <div className="max-h-[220px] overflow-y-auto rounded-[18px] border border-[#EEF2EC] bg-[#F8FAF7] px-3 py-2">
            <div className="grid gap-2">
              {movePairs.map((pair, pairIndex) => {
                const whiteMoveIndex = pairIndex * 2;
                const blackMoveIndex = whiteMoveIndex + 1;

                return (
                  <div
                    key={pair.moveNumber}
                    className="grid min-h-11 grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-[14px] bg-white px-2 py-2"
                  >
                    <span className="text-right text-sm font-bold text-[#6E7772]">
                      {pair.moveNumber}
                    </span>
                    <span className="text-right">
                      <MovePill
                        active={currentMoveIndex === whiteMoveIndex}
                        label={pair.white}
                      />
                    </span>
                    <span className="text-right">
                      <MovePill
                        active={currentMoveIndex === blackMoveIndex}
                        label={pair.black}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="chat" className="border-0">
        <AccordionTrigger className="py-3 text-right text-base font-black text-[#1F2525] hover:no-underline">
          <span className="flex items-center gap-2">
            گفت‌وگو
            {unreadCount > 0 ? (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#7F9F85] px-2 text-xs font-bold text-white">
                {unreadCount}
              </span>
            ) : null}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pt-0 pb-3">
          <div className="h-[240px] overflow-hidden rounded-[18px] border border-[#EEF2EC] bg-white">
            <ChatPanel
              chatDraft={chatDraft}
              chatMessages={chatMessages}
              isOpponentTyping={isOpponentTyping}
              messageListRef={messageListRef}
              onDraftChange={onChatDraftChange}
              onSendMessage={onSendMessage}
              padded={true}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

import { Flag, Handshake, RotateCcw, Settings2, Undo2 } from "lucide-react";
import type { RefObject } from "react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type {
  GameRoomChatMessage,
  GameRoomMovePair,
  GameRoomRequestType,
  GameRoomSettingKey,
  GameRoomSettings,
} from "../../types";
import ChatPanel from "../chatPanel";
import MovePill from "../movePill";
import RequestBanner from "../requestBanner";
import SettingToggle from "../settingToggle";
import SidebarActionButton from "../sidebarActionButton";

type DesktopSidebarProps = {
  chatDraft: string;
  chatMessages: GameRoomChatMessage[];
  currentMoveIndex: number;
  desktopChatRef: RefObject<HTMLDivElement | null>;
  incomingRequest: GameRoomRequestType | null;
  isOpponentTyping: boolean;
  movePairs: GameRoomMovePair[];
  onAcceptRequest: () => void;
  onChatDraftChange: (value: string) => void;
  onFlipBoard: () => void;
  onOfferDraw: () => void;
  onRejectRequest: () => void;
  onRequestUndo: () => void;
  onResign: () => void;
  onSendMessage: () => void;
  onToggleSetting: (key: GameRoomSettingKey) => void;
  outgoingRequest: GameRoomRequestType | null;
  settings: GameRoomSettings;
  unreadCount: number;
};

export default function DesktopSidebar({
  chatDraft,
  chatMessages,
  currentMoveIndex,
  desktopChatRef,
  incomingRequest,
  isOpponentTyping,
  movePairs,
  onAcceptRequest,
  onChatDraftChange,
  onFlipBoard,
  onOfferDraw,
  onRejectRequest,
  onRequestUndo,
  onResign,
  onSendMessage,
  onToggleSetting,
  outgoingRequest,
  settings,
  unreadCount,
}: DesktopSidebarProps) {
  return (
    <aside className="flex min-h-[calc(100vh-170px)] flex-col gap-4">
      <section className="rounded-[28px] border border-[#E5EAE2] bg-white p-4 shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#1F2525]">حرکت‌ها</h2>
          <Badge className="bg-[#F0F4ED] text-[#5B7A62] hover:bg-[#F0F4ED]">
            تاریخچه زنده
          </Badge>
        </div>
        <div className="mt-4 max-h-[360px] overflow-y-auto rounded-[20px] border border-[#EEF2EC]">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-[#F8FAF7]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-14 text-right text-[#6E7772]">
                  #
                </TableHead>
                <TableHead className="text-right text-[#6E7772]">
                  سفید
                </TableHead>
                <TableHead className="text-right text-[#6E7772]">
                  سیاه
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movePairs.map((pair, pairIndex) => {
                const whiteMoveIndex = pairIndex * 2;
                const blackMoveIndex = whiteMoveIndex + 1;

                return (
                  <TableRow
                    key={pair.moveNumber}
                    className="hover:bg-[#F9FBF8]"
                  >
                    <TableCell className="text-right font-semibold text-[#6E7772]">
                      {pair.moveNumber}
                    </TableCell>
                    <TableCell className="text-right">
                      <MovePill
                        active={currentMoveIndex === whiteMoveIndex}
                        label={pair.white}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <MovePill
                        active={currentMoveIndex === blackMoveIndex}
                        label={pair.black}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#E5EAE2] bg-white p-4 shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
        <div className="grid grid-cols-2 gap-2">
          <SidebarActionButton
            icon={Handshake}
            label={outgoingRequest === "draw" ? "در انتظار..." : "تساوی"}
            onClick={onOfferDraw}
          />
          <SidebarActionButton
            icon={Undo2}
            label={outgoingRequest === "undo" ? "در انتظار..." : "بازگشت"}
            onClick={onRequestUndo}
          />
          <SidebarActionButton
            icon={RotateCcw}
            label="چرخش"
            onClick={onFlipBoard}
          />
          <SidebarActionButton
            icon={Flag}
            label="تسلیم"
            onClick={onResign}
            danger={true}
          />
        </div>

        {incomingRequest ? (
          <div className="mt-4">
            <RequestBanner
              requestType={incomingRequest}
              onAccept={onAcceptRequest}
              onReject={onRejectRequest}
            />
          </div>
        ) : null}

        <div className="mt-4 rounded-[20px] border border-[#EEF2EC] bg-[#F8FAF7] p-3">
          <div className="mb-3 flex items-center gap-2">
            <Settings2 className="size-4 text-[#6E7772]" />
            <p className="text-sm font-bold text-[#1F2525]">تنظیمات سریع</p>
          </div>
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
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-[#E5EAE2] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
        <div className="flex items-center justify-between border-b border-[#EEF2EC] px-4 py-4">
          <h2 className="text-lg font-black text-[#1F2525]">گفت‌وگو</h2>
          {unreadCount > 0 ? (
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#7F9F85] px-2 text-xs font-bold text-white">
              {unreadCount}
            </span>
          ) : null}
        </div>
        <ChatPanel
          chatDraft={chatDraft}
          chatMessages={chatMessages}
          isOpponentTyping={isOpponentTyping}
          messageListRef={desktopChatRef}
          onDraftChange={onChatDraftChange}
          onSendMessage={onSendMessage}
          padded={false}
        />
      </section>
    </aside>
  );
}

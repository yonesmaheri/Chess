import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  formatPercent,
  formatPersianNumber,
  formatSignedPercent,
  getInitials,
} from "../lib/utils";
import type { LeaderboardPlayer } from "../types";
import IranFlag from "./IranFlag";

type LeaderboardTableProps = {
  rows: LeaderboardPlayer[];
  isLoading: boolean;
};

export default function LeaderboardTable({
  rows,
  isLoading,
}: LeaderboardTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#FCFDFC] hover:bg-[#FCFDFC]">
          <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
            رتبه
          </TableHead>
          <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
            بازیکن
          </TableHead>
          <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
            کشور
          </TableHead>
          <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
            ELO
          </TableHead>
          <TableHead className="h-14 px-6 text-right font-bold text-[#4F5553]">
            درصد برد
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 7 }, (_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell className="px-6 py-4 text-right">
                  <Skeleton className="mr-auto h-6 w-8 bg-[#F2F5F1]" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Skeleton className="size-11 rounded-full bg-[#F2F5F1]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28 bg-[#F2F5F1]" />
                      <Skeleton className="h-3 w-20 bg-[#F2F5F1]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Skeleton className="mr-auto h-9 w-24 rounded-full bg-[#F2F5F1]" />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Skeleton className="mr-auto h-6 w-16 bg-[#F2F5F1]" />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Skeleton className="mr-auto h-6 w-20 bg-[#F2F5F1]" />
                </TableCell>
              </TableRow>
            ))
          : rows.map((player) => (
              <TableRow key={player.id} className="hover:bg-[#FAFCFA]">
                <TableCell className="px-6 py-4 text-right text-lg font-bold text-[#2D3231]">
                  {formatPersianNumber(player.rank)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Avatar className="size-11 border-[3px] border-white shadow-[0_10px_24px_rgba(31,37,37,0.12)]">
                      <AvatarFallback className="bg-[linear-gradient(135deg,#DCD9D1_0%,#BBB2A4_100%)] text-sm font-bold text-[#34413B]">
                        {getInitials(player.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-semibold text-[#1F2525]">
                          {player.name}
                        </span>
                        {player.verified ? (
                          <BadgeCheck className="size-4 fill-[#6F9D78] text-[#6F9D78]" />
                        ) : null}
                      </div>
                      <p className="text-xs text-[#7A7F7C]">
                        بازیکن فعال این بخش
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#E9ECE8] bg-[#FAFCFA] px-3 py-1.5 text-sm text-[#4F5553]">
                    <IranFlag />
                    {player.countryName}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-base font-bold text-[#2D3231]">
                  {formatPersianNumber(player.elo)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="space-y-1">
                    <p className="font-semibold text-[#2D3231]">
                      {formatPercent(player.winRate)}
                    </p>
                    <p className="text-sm font-medium text-[#5E946A]">
                      {formatSignedPercent(player.trend)}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}

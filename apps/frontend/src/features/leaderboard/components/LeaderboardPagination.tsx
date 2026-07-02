import { ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/shared/components/ui/pagination";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { formatPersianNumber, getPageItems } from "../lib/utils";

type LeaderboardPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function LeaderboardPagination({
  currentPage,
  totalPages,
  onPageChange,
}: LeaderboardPaginationProps) {
  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <Pagination className="mx-0 w-auto justify-end">
      <PaginationContent>
        <PaginationItem>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="صفحه اول"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={cn("border border-transparent", currentPage === 1 && "opacity-50")}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="gap-2"
          >
            قبلی
          </Button>
        </PaginationItem>
        {pageItems.map((item, index) => (
          <PaginationItem key={`${item}-${index}`}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <Button
                type="button"
                variant={item === currentPage ? "outline" : "ghost"}
                size="icon"
                aria-current={item === currentPage ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {formatPersianNumber(item)}
              </Button>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="gap-2"
          >
            بعدی
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="صفحه آخر"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={cn(
              "border border-transparent",
              currentPage === totalPages && "opacity-50",
            )}
          >
            <ChevronsLeft className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

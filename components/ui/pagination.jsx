import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Pagination({
    currentPage,
    totalPages,
    onPageChange
}) {
    if (totalPages <= 1) return null;

    const renderPageButtons = () => {
        const pages = [];

        pages.push(
            <Button
                key={1}
                aria-label="Page 1" aria-current={currentPage === 1 ? "page" : undefined}
                variant={currentPage === 1 ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(1)}
            >
                1
            </Button>
        );

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (startPage > 2) {
            pages.push(
                <Button key="start-ellipsis" variant="outline" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            );
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    aria-label={`Page ${i}`} aria-current={currentPage === i ? "page" : undefined}
                    variant={currentPage === i ? "default" : "outline"}
                    size="icon"
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </Button>
            );
        }
        if (endPage < totalPages - 1) {
            pages.push(
                <Button key="end-ellipsis" variant="outline" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            );
        }
        if (totalPages > 1) {
            pages.push(
                <Button
                    key={totalPages}
                    aria-label={`Page ${totalPages}`} aria-current={currentPage === totalPages ? "page" : undefined}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="icon"
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </Button>
            );
        }

        return pages;
    };

    return (
        <nav aria-label="Contact pages" className="flex flex-wrap items-center justify-center gap-1.5 py-2">
            <Button
                variant="outline"
                size="icon"
                aria-label="Previous page"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {renderPageButtons()}

            <Button
                variant="outline"
                size="icon"
                aria-label="Next page"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </nav>
    );
}
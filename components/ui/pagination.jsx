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
        <div className="flex items-center justify-center space-x-2 py-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {renderPageButtons()}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
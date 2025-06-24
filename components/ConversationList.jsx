import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { PlusIcon } from "lucide-react";

export function ConversationList({ conversations = [], isLoading, onSelect, selectedId }) {
    return (
        <div className="flex flex-col h-full">
            <Button
                variant="outline"
                className="w-full mb-4 flex items-center gap-2"
                onClick={() => onSelect(null)}
            >
                <PlusIcon className="w-4 h-4" />
                New Chat
            </Button>

            <ScrollArea className="flex-1">
                <div className="space-y-1">
                    {isLoading &&
                        Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 rounded-lg" />
                        ))}

                    {!isLoading &&
                        conversations.map((conv) => (
                            <button
                                key={conv._id}
                                className={cn(
                                    "w-full text-left px-4 py-2 rounded-lg transition-colors text-sm hover:bg-[grey] hover:text-foreground cursor-pointer",
                                    conv._id === selectedId
                                        ? "bg-[grey] text-foreground"
                                        : ""
                                )}
                                onClick={() => onSelect(conv)}
                            >
                                <div className="font-medium truncate">{conv.title || "Untitled"}</div>
                                <div className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(conv.lastUpdated), { addSuffix: true })}
                                </div>
                            </button>
                        ))}
                </div>
            </ScrollArea>
        </div>
    );
}

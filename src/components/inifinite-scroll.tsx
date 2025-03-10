import { UseInteractionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps{
    isManual?: boolean,
    hasNextPage:boolean,
    isFetchingNextPage:boolean,
    fetchNextpage:()=>void,
    
}

export const PageInfinteScroll = ({
    isManual=false,
    hasNextPage,
    isFetchingNextPage,
    fetchNextpage
}: InfiniteScrollProps) => {
    const { targetRef, isIntersect } = UseInteractionObserver({
        threshold: 0.5,
        rootMargin: "100px",
    });

    useEffect(() => {
        if (isIntersect && hasNextPage && !isFetchingNextPage && !isManual) {
            fetchNextpage();
        }
    }, [isManual, hasNextPage, isFetchingNextPage, fetchNextpage, isIntersect]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div ref={targetRef} className="h-1" />
            {hasNextPage ? (
                <Button
                    variant="secondary"
                    disabled={!hasNextPage || isFetchingNextPage}
                    onClick={() => fetchNextpage()}
                >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
            ) : (
                <p className="text-xs text-muted-foreground">
                    You have reached the end of the list
                </p>
            )}
        </div>
    );
};

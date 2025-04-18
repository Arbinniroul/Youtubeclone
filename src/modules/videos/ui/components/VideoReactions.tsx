import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {  ThumbsDown, ThumbsUp } from "lucide-react"

export const VideoReaction=()=>{
    const viewerReaction:"like" | "dislike"="like";
    return(
        <div className="flex items-center  flex-none">
            <Button variant="secondary" className="rounded-l-full rounded-r-none gap-2 pr-4">
                <ThumbsUp className={cn("size-5",viewerReaction ==="like" && "fill-black")}/>
                {1}
            </Button>
            <Separator orientation="vertical" className="h-7"/>

            <Button variant="secondary" className="rounded-l-none rounded-r-full pl-3">
                <ThumbsDown className={cn("size-5",viewerReaction !== "like" && "fill-black")}/>
                {1}
            </Button>
        </div>
    )
}
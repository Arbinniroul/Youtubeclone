import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { CornerDownRightIcon, Loader2Icon } from "lucide-react"
import { CommentItem } from "./comment-item"
import { Button } from "@/components/ui/button"

interface commentRepliesProps{
    videoId:string,
    parentId:string
}

export const CommentReplies=({videoId,parentId}:commentRepliesProps)=>{
    const {data,isLoading,fetchNextPage,hasNextPage,isFetchingNextPage}=trpc.comments.getMany.useInfiniteQuery({
        limit:DEFAULT_LIMIT,
        videoId,
        parentId,

    },{
        getNextPageParam:(lastPage)=>lastPage.nextCursor
    })
    return(
        <div className="pl-14">
            <div className="flex flex-col mt-2 gap-4">
                {isLoading &&(
                    <div className="flex items-center justify-center">
                        <Loader2Icon className="size-6 animate-spin text-muted-foreground"/>

                    </div>

                )}
                {
                    !isLoading && data.pages.flatMap((page)=>page.items)
                    .map((comment)=>(
                        <CommentItem key={comment.id} comment={comment} variant="reply"/>
                    )
                    )
                }
            </div>
            {
                hasNextPage&&(
                    <Button variant="tertiary" size="sm" onClick={()=>fetchNextPage()} disabled={isFetchingNextPage}><CornerDownRightIcon/> Show more Replies</Button>
                )
            }
        </div>
    )

}
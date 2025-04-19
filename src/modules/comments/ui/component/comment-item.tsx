import Link from "next/link";
import { CommentGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow, set } from "date-fns";
import { trpc } from "@/trpc/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import { current } from "@reduxjs/toolkit";
import { CommentReplies } from "./comment-replies";


interface commentItemProps{
    comment:CommentGetManyOutput["items"][number];
    variant:"reply"|"comment"
}

export const CommentItem=({comment,variant="comment"}:commentItemProps)=>{
    const utils=trpc.useUtils();
    const clerk=useClerk();
const remove=trpc.comments.remove.useMutation({
    onSuccess:()=>{
        toast.success("Comment Deleted")
        utils.comments.getMany.invalidate({videoId:comment.videoId});
    },
    onError:(error)=>{
        toast.error("Error ")
    if(error.data?.code==="UNAUTHORIZED"){
        clerk.openSignIn();
    }
    }
});
const {userId}=useAuth();
const [isReplyOpen,setIsReplyOpen]=useState(false);
const [isRepliesOpen,setIsRepliesOpen]=useState(false);
const like=trpc.commentReactions.like.useMutation({
    onSuccess:()=>{
        utils.comments.getMany.invalidate({videoId:comment.videoId})
    },
    onError:(error)=>{
        toast.error("something went wrong")
        if(error.data?.code==="UNAUTHORIZED"){
            clerk.openSignIn();
        }
    }
});
const dislike=trpc.commentReactions.dislike.useMutation({
    onSuccess:()=>{
        utils.comments.getMany.invalidate({videoId:comment.videoId})
    },
    onError:(error)=>{
        toast.error("something went wrong")
        if(error.data?.code==="UNAUTHORIZED"){
            clerk.openSignIn();
        }
    }
});

    return (
        <div className="">
                <div className="flex gap-4">
                    <Link href={`/users/${comment.userId}`}>
                    <UserAvatar size={variant==="comment"?"lg":"sm"} imageUrl={comment.user.imageUrl} name={comment.user.name}/>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <Link href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">
                                {comment.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {
                                    formatDistanceToNow(comment.updatedAt,{
                                        addSuffix:true
                                    })
                                }
                            </span>

                        </div>

                        </Link>
                        <p className="text-sm">{comment.value}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                        <Button className="size-8"
                                        variant="ghost" disabled={like.isPending}
                                        onClick={()=>like.mutate({commentId:comment.id})}
                                        >
                                            <ThumbsUpIcon className={cn(comment.viewerReactions==="like"&&"fill-black")}/>
                                        </Button>
                                        <span className="text-xs text-muted-foreground">{comment.likeCount}</span>
                                        <Button className="size-8"
                                        variant="ghost" disabled={dislike.isPending}
                                        onClick={()=>dislike.mutate({commentId:comment.id})}
                                        
                                        >
                                            <ThumbsDownIcon className={cn(comment.viewerReactions==="dislike"&&"fill-black")}/>
                                        </Button>
                                        <span className="text-xs text-muted-foreground">{comment.dislikeCount}</span>


                                    </div>
                                    {variant ==="comment"&& (<Button className="h-8" variant="ghost" size="sm" onClick={()=>{setIsReplyOpen(true)}}>
                                        Reply
                                    </Button>)}

                                </div>

                    </div>
                    {
                        comment.user.clerkId ===userId && variant==="reply" && (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreVerticalIcon/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end"  >
                            <DropdownMenuItem onClick={()=>{{setIsReplyOpen(true)}}} className="flex">
                                <MessageSquareIcon className="size-4"/>
                                Reply
                            </DropdownMenuItem>
                            {comment.user.clerkId === userId &&(
                            <DropdownMenuItem onClick={()=>remove.mutate({id:comment.id})
                            } className="flex">
                                <Trash2Icon className="size-4"/>
                                Delete
                            </DropdownMenuItem>)}
                        </DropdownMenuContent>
                    </DropdownMenu>
)
}
                </div>
       {isReplyOpen && variant==="comment" &&(
        <div className="mt-14 pl-14">
            <CommentForm
            variant="reply"
            parentId={comment.id}
            onCancel={()=>setIsReplyOpen(false)}
            videoId={comment.videoId}
            onSuccess={()=>{
                setIsReplyOpen(false);
                setIsRepliesOpen(true);
            }}
            />

        </div>
       )}
       {comment.replyCount>0 && variant==="comment" &&(
        <div className="pl-4">
            <Button variant="tertiary" size="sm" onClick={()=>setIsRepliesOpen((current)=>!current)}>
                {
                    isRepliesOpen?<ChevronUp/>:<ChevronDown/>
                }
                {
                    comment.replyCount
                } replies

            </Button>
        </div>
       )}
       {comment.replyCount>0 && variant==="comment" && isRepliesOpen &&(
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
       )}
        </div>
    )

}


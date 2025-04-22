import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {   ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { VideoGetOneOutput } from "../../types";

import { trpc } from "@/trpc/client";
import { toast } from "sonner";


interface VideoReactionProps{
    videoId:string,
    likes:number,
    dislikes:number,
    viewerReaction:VideoGetOneOutput["viewerReactions"],
}
export const VideoReaction=({
    videoId,likes,dislikes,viewerReaction
}:VideoReactionProps)=>{

const utils=trpc.useUtils();
const like=trpc.videoReactions.like.useMutation({
    onSuccess:()=>{
        utils.videos.getOne.invalidate({id:videoId})
        utils.playlists.getLiked.invalidate()
        
    },
    onError:()=> {
        toast.error("Something Went Wrong")
     
    },
})
const dislike=trpc.videoReactions.dislike.useMutation({
    onSuccess:()=>{
        utils.videos.getOne.invalidate({id:videoId})
        utils.playlists.getLiked.invalidate()
    },
    onError:()=> {
        toast.error("Something Went Wrong")
        
}})
    return(
        <div className="flex items-center  flex-none">
            <Button variant="secondary" className="rounded-l-full rounded-r-none gap-2 pr-4" onClick={()=>like.mutate({videoId})} disabled={like.isPending||dislike.isPending}>
                <ThumbsUpIcon className={cn("size-5",viewerReaction ==="like" && "fill-black")}/>
                {likes}
            </Button>
            <Separator orientation="vertical" className="h-7"/>

            <Button variant="secondary" className="rounded-l-none rounded-r-full pl-3" onClick={()=>dislike.mutate({videoId})} disabled={like.isPending||dislike.isPending}>
                <ThumbsDownIcon className={cn("size-5",viewerReaction === "dislike" && "fill-black")}/>
                {dislikes}
            </Button>
        </div>
    )
}
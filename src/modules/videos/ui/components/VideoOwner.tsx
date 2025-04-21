import Link from "next/link";
import { VideoGetOneOutput } from "../../types";

import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscription/ui/components/SubscriptionButton";
import { UserInfo } from "@/modules/users/ui/components/UserInfo";
import { UserSubscriptions } from "@/modules/subscription/hooks/user-subscription";
import { useAuth } from "@clerk/nextjs";


interface videoOwnerProps{
    user:VideoGetOneOutput["user"]
    videoId:string
}

export const VideoOwner=({user,videoId}:videoOwnerProps)=>{

    const {userId:clerkUserId,isLoaded}=useAuth()
    const {isPending,onClick}=UserSubscriptions({
      userId:user.id,
      isSubscribed:user.viewerSubscribed,
      fromVideoId:videoId

    })
    return(
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
                <Link href={`/user/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                   <div className="flex flex-col gap-1 min-w-0">
                    <UserInfo size="lg" name={user.name}/>
                    <span className="text-sm text-muted-foreground line-clamp-1">
                        {/* TODO:properly fill subscriber count */}
                        {user.subscriberCount} subscribers
                    </span>

                   </div>
                </div>
                </Link>
              {clerkUserId==user.clerkId?(
                <Button variant="secondary" className="rounded-full" asChild>
                <Link href={`/studio/videos/${videoId}`}>
                Edit Video
                </Link>
                </Button>
              )
              :(
                <SubscriptionButton 
                onClick={onClick} disabled={isPending || !isLoaded} isSubscribed={user.viewerSubscribed} className="flex-none"/>


              )
            }
        </div>
    )
}
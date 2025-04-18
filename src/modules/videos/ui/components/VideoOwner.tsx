import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscription/ui/components/SubscriptionButton";
import { UserInfo } from "@/modules/users/ui/components/UserInfo";

interface videoOwnerProps{
    user:VideoGetOneOutput["user"]
    videoId:string
}

export const VideoOwner=({user,videoId}:videoOwnerProps)=>{
    const {userId:clerkUserId}=useAuth()
    return(
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
                <Link href={`/user/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                   <div className="flex flex-col gap-1 min-w-0">
                    <UserInfo size="lg" name={user.name}/>
                    <span className="text-sm text-muted-foreground line-clamp-1">
                        {/* TODO:properly fill subscriber count */}
                        {0} Subscribers
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
                onClick={()=>{}} disabled={false} isSubscribed={false} className="flex-none"/>


              )
            }
        </div>
    )
}
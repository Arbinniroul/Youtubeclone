
"use client"
import { PageInfinteScroll } from "@/components/inifinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/VideoGridBar";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/VideoRowCard";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


export const LikedVideoSection=()=>{
    return(
        <Suspense  fallback={<LikedVideoSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
            <LikedVideoSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}
const LikedVideoSectionSkeleton=()=>{
    return(
        <div>
   <div className="flex flex-col gap-4 gap-y-10 md:hidden">

{
    Array.from({length:18}).map((_,index)=>(
        <VideoGridCardSkeleton key={index}/>)
    )
}
</div>
<div className="hidden flex-col gap-4  md:flex">

{
    Array.from({length:18}).map((_,index)=>(
        <VideoRowCardSkeleton key={index} size="compact"/>)
    )
}
</div>
        </div>
         
    )
}
const LikedVideoSectionSuspense=()=>{
    const [videos,query]=trpc.playlists.getLiked.useSuspenseInfiniteQuery({
        limit:DEFAULT_LIMIT},
        {
            getNextPageParam:(lastPage)=>lastPage.nextCursor
        }
    )
    return(
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">

           {videos.pages.flatMap((page)=>page.items).map((video)=>
           (
               <VideoGridCard key={video.id} data={video}/>
            )
        )}
        </div>
        <div className="hidden flex-col gap-4  md:flex">

{videos.pages.flatMap((page)=>page.items).map((video)=>
(
    <VideoRowCard key={video.id} data={video} size="compact"/>
 )
)}
</div>
        
        <PageInfinteScroll isFetchingNextPage={query.isFetchingNextPage} hasNextPage={query.hasNextPage} fetchNextpage={query.fetchNextPage}/>
        </div>
    )

}
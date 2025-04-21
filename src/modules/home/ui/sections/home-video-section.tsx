"use client"
import { PageInfinteScroll } from "@/components/inifinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/VideoGridBar";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface homeVideoSectionProps{
    categoryId?:string;
}

export const HomeVideoSection=({categoryId}:homeVideoSectionProps)=>{
    return(
        <Suspense key={categoryId} fallback={<HomeVideoSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
            <HomeVideoSectionSuspense categoryId={categoryId}/>
            </ErrorBoundary>
        </Suspense>
    )
}
const HomeVideoSectionSkeleton=()=>{
    return(
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
            {
                Array.from({length:18}).map((_,index)=>(
                    <VideoGridCardSkeleton key={index}/>)
                )
            }
        </div>
    )
}
const HomeVideoSectionSuspense=({categoryId}:homeVideoSectionProps)=>{
    const [videos,query]=trpc.videos.getMany.useSuspenseInfiniteQuery({
        categoryId:categoryId,limit:DEFAULT_LIMIT},
        {
            getNextPageParam:(lastPage)=>lastPage.nextCursor
        }
    )
    return(
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">

           {videos.pages.flatMap((page)=>page.items).map((video)=>
           (
               <VideoGridCard key={video.id} data={video}/>
            )
        )}
        </div>
        <PageInfinteScroll isFetchingNextPage={query.isFetchingNextPage} hasNextPage={query.hasNextPage} fetchNextpage={query.fetchNextPage}/>
        </div>
    )

}
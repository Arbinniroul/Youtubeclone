"use client";

import { DEFAULT_LIMIT } from "@/constants";

import { trpc } from "@/trpc/client";
import { VideoRowCard, VideoRowCardSkeleton } from "../components/VideoRowCard";
import { VideoGridCard, VideoGridCardSkeleton } from "../components/VideoGridBar";
import { PageInfinteScroll } from "@/components/inifinite-scroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface suggestionProps{
  videoId:string;
  isManual?:boolean
}

 const  SuggestionSection=({videoId,isManual}:suggestionProps)=>{
  return(
     <Suspense fallback={<SuggestionSectionSkeleton/>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <SuggestionSectionSuspense videoId={videoId} isManual={isManual}/>
      </ErrorBoundary>

     </Suspense>
  )
}
const SuggestionSectionSkeleton=()=>{
  return(
    <>
    <div className="hidden md:block space-y-3">
      {Array.from({length:8}).map((_,index)=>(
        <VideoRowCardSkeleton key={index} size="compact"/>
      ))}
    </div>
    <div className="block md:hidden space-y-10">
    {Array.from({length:8}).map((_,index)=>(
        <VideoGridCardSkeleton key={index}/>
      ))}
    </div>
    </>

  )
}
const SuggestionSectionSuspense = ({videoId,isManual}:suggestionProps) => {
  const [suggestions,query]=trpc.suggestion.getMany.useSuspenseInfiniteQuery({
    videoId:videoId,
    limit:DEFAULT_LIMIT,

  },{
    
    getNextPageParam: (lastPage) => lastPage.nextCursor,
})
  return (
    <>
    <div className="hidden md:block space-y-3">{
      suggestions.pages.flatMap((page)=>page.items.map((video)=>(
        <VideoRowCard key={video.id} data={video} size="compact"/>
      )))
    }</div>
    <div className="block md:hidden space-y-10">
      {  suggestions.pages.flatMap((page)=>page.items.map((video)=>(
        <VideoGridCard key={video.id} data={video}/>
      )))
    }

    </div>
    <PageInfinteScroll 
    isManual={isManual}
    hasNextPage={query.hasNextPage}
     isFetchingNextPage={query.isFetchingNextPage} 
     fetchNextpage={query.fetchNextPage}/>
    </>
  )
}
export default SuggestionSection;

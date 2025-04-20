"use client";

import { DEFAULT_LIMIT } from "@/constants";

import { trpc } from "@/trpc/client";
import { VideoRowCard } from "../components/VideoRowCard";
import { VideoGridCard } from "../components/VideoGridBar";
import { PageInfinteScroll } from "@/components/inifinite-scroll";

interface suggestionProps{
  videoId:string;
  isManual?:boolean
}
const SuggestionSection = ({videoId,isManual}:suggestionProps) => {
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

export default SuggestionSection
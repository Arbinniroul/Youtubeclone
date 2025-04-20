"use client"

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { stringify } from "querystring";
import { VideoRowCard ,VideoRowCardSkeleton} from "@/modules/videos/ui/components/VideoRowCard";
import { VideoGridCard,VideoGridCardSkeleton } from "@/modules/videos/ui/components/VideoGridBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageInfinteScroll } from "@/components/inifinite-scroll";
 
interface ResultsSectionProps{
    query:string| undefined;
    categoryId:string |undefined

}
export const ResultSection=({query,categoryId}:ResultsSectionProps)=>{
    const isMobile=useIsMobile();

    const [results,resultsQuery]=trpc.search.getMany.useSuspenseInfiniteQuery({
        query, categoryId,limit:DEFAULT_LIMIT},

        {
            getNextPageParam:(lastPage)=>lastPage.nextCursor,
        }

)
    return(
        <>
           {isMobile ?(
            <div className="flex flex-col gap-4 space-y-2">
                {
                    results.pages.flatMap((page)=>page.items).map((video)=><VideoGridCard key={video.id} data={video}/>)
                }

            </div>
           ):
          <div className="flex flex-col gap-4 ">
            {
                  results.pages.flatMap((page)=>page.items).map((video)=><VideoRowCard key={video.id} data={video} size="default"/>)
            }

          </div> 
           }
           <PageInfinteScroll
           hasNextPage={resultsQuery.hasNextPage}
           isFetchingNextPage={resultsQuery.isFetchingNextPage}
           fetchNextPage={resultsQuery.fetchNextPage}
           />
        </>
    )
}
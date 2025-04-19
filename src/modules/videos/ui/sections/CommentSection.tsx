"use client"
import { PageInfinteScroll } from '@/components/inifinite-scroll'
import { DEFAULT_LIMIT } from '@/constants'
import { CommentForm } from '@/modules/comments/ui/component/comment-form'
import { CommentItem } from '@/modules/comments/ui/component/comment-item'
import { trpc } from '@/trpc/client'
import { Loader2Icon } from 'lucide-react'


import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
interface CommentSectionProps{
  videoId:string,

}
export const CommentSection=({videoId}:CommentSectionProps)=>{
  return(
    <Suspense fallback={<CommentSectionSkeleton/>}>
      <ErrorBoundary fallback={<p>Error...</p>} >
        <CommentSectionSuspense videoId={videoId}/>
      </ErrorBoundary>
    </Suspense>
  )
}

const CommentSectionSkeleton=()=>{
  return(
  <div className='mt-6 flex justify-center items-center '>
    <Loader2Icon className='text-muted-foreground size-7 animate-spin'/>
  </div>
  )
}
const CommentSectionSuspense = ({videoId}:CommentSectionProps) => {
  const [comments,query]=trpc.comments.getMany.useSuspenseInfiniteQuery(
    {videoId,limit:DEFAULT_LIMIT},
    {
    
      getNextPageParam: (lastPage) => lastPage.nextCursor,
  }
  )
  return (
<div className='mt-6'>
  <div className='flex flex-col gap-6'>
  <h1 className='text-xl font-bold'>{comments.pages[0].totalCount} comments</h1>
  <CommentForm videoId={videoId}/>
  <div className='flex flex-col gap-4 mt-2 '>
   {
    comments.pages.flatMap((page) => page.items).map((comment)=>(
      <CommentItem
      key={comment.id}
      comment={comment}
      />
    ))
   }
   <PageInfinteScroll
                   isManual
                   hasNextPage={query.hasNextPage}
                   isFetchingNextPage={query.isFetchingNextPage}
                   fetchNextpage={query.fetchNextPage}
               />
 </div>
  </div>
 
</div>
  )
}


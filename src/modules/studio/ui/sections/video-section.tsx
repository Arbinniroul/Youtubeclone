"use client";

import { PageInfinteScroll } from '@/components/inifinite-scroll';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import Link from 'next/link';


import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const VideoSection = () => {
    return(
        <Suspense fallback={<p>...Loading</p>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
             <VideoSectionSupense/>
            </ErrorBoundary>
        </Suspense>
    )
}
const VideoSectionSupense = () => {
    const [videos,query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        { limit: DEFAULT_LIMIT },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor, 
        }
    );

    return (
        <div className="min-h-screen space-y-4">
          <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='pl-6 w-[510px]'>Video</TableHead>
                        <TableHead >Visibility</TableHead>
                        <TableHead >Status</TableHead>
                        <TableHead >Date</TableHead>
                        <TableHead className='text-right'>Views</TableHead>
                        <TableHead className='text-right'>Comment</TableHead>
                        <TableHead className='text-right pr-6'>Likes</TableHead>\
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {videos.pages.flatMap((page)=>page.items).map((video)=>(
                    <Link href={`/studio/video.${video.id}`} key={video.id} legacyBehavior>
                        <TableRow>
                            <TableCell className='pl-6 w-[510px]'>{video.title}</TableCell>
                            
                            <TableCell>Visibility</TableCell>
                            <TableCell>status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell className='text-right'>Views</TableCell>
                            <TableCell className='text-right'>Component</TableCell>
                            <TableCell className='text-right pr-6'>Likes</TableCell>
                        </TableRow>
                    </Link>                   ))}
                </TableBody>
            </Table>
          </div>

             <PageInfinteScroll 
                isManual={false}
                hasNextPage={query.hasNextPage} 
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextpage={query.fetchNextPage}
            />
        </div>
    );
};



export default VideoSection;

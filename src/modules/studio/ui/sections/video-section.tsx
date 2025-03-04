"use client";

import { PageInfinteScroll } from '@/components/inifinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';


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
    const [data,query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        { limit: DEFAULT_LIMIT },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor, 
        }
    );

    return (
        <div className="min-h-screen space-y-4">

            {JSON.stringify(data)}
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

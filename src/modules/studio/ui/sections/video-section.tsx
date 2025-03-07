"use client";
import { format } from 'date-fns';
import { PageInfinteScroll } from '@/components/inifinite-scroll';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DEFAULT_LIMIT } from '@/constants';
import { snakeCaseToTitle } from '@/lib/utils';
import { VideoThumbnail } from '@/modules/videos/ui/components/videoThumbnail';
import { trpc } from '@/trpc/client';
import Link from 'next/link';


import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const VideoSection = () => {
    return (
        <Suspense fallback={<p>...Loading</p>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideoSectionSupense />
            </ErrorBoundary>
        </Suspense>
    )
}
const VideoSectionSupense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
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
                            <TableHead className='text-right pr-6'>Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages.flatMap((page) => page.items).map((video) => (
                            <Link href={`/studio/video.${video.id}`} key={video.id} legacyBehavior>
                                <TableRow>
                                    <TableCell className='pl-6 w-[510px]'><div className='flex items-center gap-4'>
                                        <div className='relative aspect-video w-36 shrink-0'>
                                            <VideoThumbnail imageUrl={video.thumbnailUrl} previewUrl={video.previewUrl} title={video.title} duration={video.duration ||0}/>
                                        </div>
                                        <div className='flex flex-col overflow-hidden gap-y-1 '>
                                            <span className='text-sm line-clamp-1'>{video.title}</span>
                                            <span className='text-xs text-muted-foreground'>{video.description || "No description"}</span>
                                        </div>
                                        
                                    </div></TableCell>

                                    <TableCell>Visibility</TableCell>
                                    <TableCell><div className='flex items-center '>{snakeCaseToTitle(video.muxStatus || "error")}</div></TableCell>
                                    <TableCell className='text-sm truncate  '>{format(new Date(video.createdAt), "d MMM yyyy")}</TableCell>
                                    <TableCell className='text-right'>Views</TableCell>
                                    <TableCell className='text-right'>Component</TableCell>
                                    <TableCell className='text-right pr-6'>Likes</TableCell>
                                </TableRow>
                            </Link>))}
                    </TableBody>
                </Table>
            </div>

            <PageInfinteScroll
                isManual
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextpage={query.fetchNextPage}
            />
        </div>
    );
};



export default VideoSection;

"use client";
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import React from 'react';

const VideoSection = () => {
  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );



  return (
    <div className="min-h-screen space-y-4">
      {JSON.stringify(data)}
    </div>
  );
};

export default VideoSection;

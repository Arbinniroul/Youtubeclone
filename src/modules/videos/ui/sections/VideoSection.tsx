"use client"


import { videos } from "@/db/schema";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { VideoPlayer } from "../components/videoPlayer";
import VideoBanner from "../components/VideoBanner";
import { VideoTopRow } from "../components/VideoTopRow";

interface videoSectionProps{
  videoId:string;
}
const VideoSection = ({videoId}:videoSectionProps) => {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense videoId={videoId}/>
      </ErrorBoundary>
    </Suspense>
  )
}
const VideoSectionSuspense=({videoId}:videoSectionProps)=> {
  const[ video]=trpc.videos.getOne.useSuspenseQuery({id:videoId})
  return (
 <>
<div className={cn("aspect-video bg-black rounded-xl overflow-hidden  relative ",video.muxStatus !=="ready" && "rounded-b-none")}>
<VideoPlayer
autoPlay
onPlay={()=>{}}
playbackId={video.muxPlaybackId}
thumbnailUrl={video.thumbnailUrl}
/>
</div>
<VideoBanner status={video.muxStatus}/>
<VideoTopRow video={video}/>
 </>
  )

}


export default VideoSection
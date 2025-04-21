import { DEFAULT_LIMIT } from "@/constants";
import VideoView from "@/modules/videos/ui/views/VideoView";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic="force-dynamic"

interface pageProps{
  params:Promise<{videoId:string}>;
}
const Page = async({params}:pageProps) => {
  const {videoId}=await params;

  void trpc.videos.getOne.prefetch({id:videoId})
  void trpc.comments.getMany.prefetchInfinite({videoId:videoId,limit:DEFAULT_LIMIT})
  void trpc.suggestion.getMany.prefetchInfinite({videoId,limit:DEFAULT_LIMIT})

  return (
    <HydrateClient>
      <VideoView videoId={videoId}/>
    </HydrateClient>
  )
}

export default Page
import VideoView from "@/modules/videos/ui/views/VideoView";
import { HydrateClient, trpc } from "@/trpc/server";

interface pageProps{
  params:Promise<{videoId:string}>;
}
const Page = async({params}:pageProps) => {
  const {videoId}=await params;

  void trpc.videos.getOne.prefetch({id:videoId})
  //TODO: dont forget to do prefetch infinite
  void trpc.comments.getMany.prefetch({videoId:videoId})
  return (
    <HydrateClient>
      <VideoView videoId={videoId}/>
    </HydrateClient>
  )
}

export default Page
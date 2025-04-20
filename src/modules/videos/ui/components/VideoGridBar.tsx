import Link from "next/link";
import { VideoGetManyOutput } from "../../types";
import { VideoThumbnail, VideoThumbnailSkeleton } from "./videoThumbnail";
import { VideoInfo, VideoInfoSkeleton } from "./VideoInfo";
interface videoGridCard {
    data:VideoGetManyOutput["items"][number];
    onRemove?:()=>void

}
export const VideoGridCardSkeleton=()=>{
    return(
        <div className="flex flex-col gap-2 w-full">
            <VideoThumbnailSkeleton/>
            <VideoInfoSkeleton/>
        </div>
    )
}
export const VideoGridCard=({data,onRemove}:videoGridCard)=>{
    return(
        <div className="flex flex-col gap-2 w-full group">

            <Link href={`/videos/${data.id}`}>
            <VideoThumbnail
            imageUrl={data.thumbnailUrl}
            previewUrl={data.previewUrl}
            title={data.title}
            duration={data.duration}
        />
            </Link>
            <VideoInfo data={data} onRemove={onRemove}/>
        </div>
    )
}
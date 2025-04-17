import { VideoGetOneOutput } from "../../types";
import { VideoOwner } from "./VideoOwner";

interface videoTopRowProps{
    video:VideoGetOneOutput;
}
export const VideoTopRow=({video}:videoTopRowProps)=>{
    return (
<div className="flex flex-col gap-4 mt-4 ">
    <h1 className="text-xl font-semibold">{video.title}</h1>
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner user={video.user} videoId={video.id}/>

    </div>

</div>
    )
}
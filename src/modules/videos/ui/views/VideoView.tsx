
import { CommentSection } from "../sections/CommentSection";
import SuggestionSection from "../sections/SuggestionSection";
import VideoSection from "../sections/VideoSection";

interface videoViewProps {
    videoId: string;
}
const VideoView = ({ videoId }: videoViewProps) => {
    return (
        <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 min-w-0">
                    <VideoSection videoId={videoId}/>
                <div className="xl:hidden block mt-4">
                    <SuggestionSection videoId={videoId} isManual/>
                </div>
                <CommentSection videoId={videoId}/>
                </div>
                <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[480px] shrink-1">
                <SuggestionSection videoId={videoId} />

                </div>
            </div>

        </div>
    )
}

export default VideoView
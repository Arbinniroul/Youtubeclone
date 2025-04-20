import { formatDuration } from "@/lib/utils";
import Image from "next/image"
import { THUMBNAIL_FALLBACK } from "../../constant";
import { Skeleton } from "@/components/ui/skeleton";
interface videoThumbnailProps{
    title:string;
    duration:number;
    imageUrl?:string;
    previewUrl?:string;

}
export const VideoThumbnailSkeleton=()=>{
  return (
    <div className="relative w-full overflow-hidden  rounded-xl aspect-video">
      <Skeleton className="size-full"/>
    </div>
  )
}
export const VideoThumbnail = ({
    imageUrl,
    title,
    previewUrl,
    duration
  }: videoThumbnailProps) => {
    // Helper function to validate URLs
    const getValidUrl = (url?: string) => {
      if (!url) return THUMBNAIL_FALLBACK;
      
      // If already a valid URL (absolute or relative with /)
      if (url.startsWith('http') || url.startsWith('/')) {
        return url;
      }
      
      // If it's a base64 image
      if (url.startsWith('data:')) {
        return url;
      }
      
      // Otherwise treat as relative path (add leading slash)
      return `/${url}`;
    };
  
    const validImageUrl = getValidUrl(imageUrl);
    const validPreviewUrl = getValidUrl(previewUrl);
  
    return (
      <div className="relative group">
        <div className="relative w-full overflow-hidden rounded-xl aspect-video">
          <Image 
            src={validImageUrl} 
            alt={title}
            fill 
            className="size-full object-cover group-hover:opacity-0" 
          />
          <Image 
            src={validPreviewUrl} 
            alt={title} 
            fill 
            className="size-full object-cover opacity-0 group-hover:opacity-100" 
          />
        </div>
        <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
          {formatDuration(duration)}
        </div>
      </div>
    );
  };
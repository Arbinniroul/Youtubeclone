import { ResponsiveModel } from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

 interface ThumbnailUploadModalProps{
    videoId:string,
    open:boolean,
    onOpenChange:(open:boolean)=>void;
 }
export const ThumbnailUploadModal=({
    videoId,
    open,
    onOpenChange
}:ThumbnailUploadModalProps)=>{
    const utils=trpc.useUtils();
    const onUploadComplete=()=>{
        utils.studio.getMany.invalidate();
        utils.studio.getOne.invalidate({id:videoId})
        onOpenChange(false);

    }
return(

 <ResponsiveModel title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>

<UploadDropzone endpoint="thumbnailUploader" input={{videoId}} className="bg-gray-400 text-blue-700" onClientUploadComplete={onUploadComplete} />


</ResponsiveModel>

   
)
}
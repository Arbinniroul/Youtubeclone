import MuxUploader from "@mux/mux-uploader-react";

interface UploaderProps{
    endPoint?: string | null;
    onSucess?: ()=>void;
}

export const StudioUploader=({endPoint,onSuccess}:UploaderProps)=>{
     return(
        <div>
            <MuxUploader/>
        </div>
     )
}
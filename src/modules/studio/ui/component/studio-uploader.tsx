import { Button } from "@/components/ui/button";
import MuxUploader, { MuxUploaderDrop, MuxUploaderFileSelect, MuxUploaderProgress, MuxUploaderStatus } from "@mux/mux-uploader-react";
import { Upload, UploadIcon } from "lucide-react";

interface UploaderProps {
  endpoint?: string | null;  // Change endPoint to endpoint here
  onSuccess?: () => void;
}
const UPLOADER_ID='video-uploader';
export const StudioUploader = ({ endpoint, onSuccess }: UploaderProps) => {
  return (
    <div>
      <MuxUploader endpoint={endpoint} onSuccess={onSuccess} id={UPLOADER_ID} className="hidden group/uploader" />
      <MuxUploaderDrop muxUploader={UPLOADER_ID} className="group/drop">
       <div slot="heading" className="flex flex-col items-center gap-6"> 
        <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
          <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300"/>

        </div>
        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm">Drag and Drop files to Upload</p>
          <p className="text-xs text-muted-foreground">Your videos will be private until you publish them</p>
        </div>
        <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
          <Button className="rounded-full" type="button">
            Select Files
          </Button>

        </MuxUploaderFileSelect>
       </div>
       <span slot="separator" className="hidden"/>
       <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm"/>
        <MuxUploaderProgress muxUploader={UPLOADER_ID} className="text-sm" type="percentage"/>
        <MuxUploaderProgress muxUploader={UPLOADER_ID}  type="bar"/>
      </MuxUploaderDrop>

    </div>
  );
};

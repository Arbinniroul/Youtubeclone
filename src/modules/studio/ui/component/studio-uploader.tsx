import MuxUploader from "@mux/mux-uploader-react";

interface UploaderProps {
  endpoint?: string | null;  // Change endPoint to endpoint here
  onSuccess?: () => void;
}

export const StudioUploader = ({ endpoint, onSuccess }: UploaderProps) => {
  return (
    <div>
      <MuxUploader endpoint={endpoint} onSuccess={onSuccess} />
    </div>
  );
};

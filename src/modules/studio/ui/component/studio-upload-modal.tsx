"use client";
import { ResponsiveModel } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, Plus } from "lucide-react";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader";

export const StudioUploadModel = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.createVideo.useMutation({
    onError: (error) => {
      console.log("Error occurred:", error);
      toast.error(error.message); // Use toast.error for errors
    },
    onSuccess: () => {
      toast.success("Video created successfully");
      utils.studio.getMany.invalidate();
    },
  });
console.log("create",create)
  return (
    <>
      <ResponsiveModel
        title="Upload a Video"
        open={!!create.data?.url}
        onOpenChange={() => {
          create.reset();
        }}
      >
        {create.data?.url ? (
          <StudioUploader
            endpoint={create.data.url}
            onSuccess={() => {
              toast.success("Video uploaded successfully");
            }}
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
        <p>This will be an uploader</p>
      </ResponsiveModel>
      <Button
        variant="secondary"
        onClick={() => {
          create.mutate(undefined, {
            onSuccess: (data) => console.log("Mutation Success:", data),
            onError: (error) => console.error("Mutation Error:", error),
            onSettled: () => console.log("Mutation Settled"),
          });
        }}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <Plus />
        )}
        Create
      </Button>
    </>
  );
};
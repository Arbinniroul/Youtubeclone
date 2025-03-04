"use client"
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, Plus } from "lucide-react";
import { toast } from "sonner";

export const StudioUploadModel = () => {

    const utils=trpc.useUtils()
    const create = trpc.videos.createVideo.useMutation({
      onError: (error) => {
        console.log("Error occurred:", error);
        toast.success(error.message);
      },
      onSuccess: () => {

        toast.success("Video created successfully");
        utils.studio.getMany.invalidate();
      },
      
    });
    

  return (
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
  {create.isPending ? <Loader2Icon className="animate-spin" /> : <Plus />}
  Create
</Button>

  
  );
};

"use client"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { videoUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { CopyCheckIcon, CopyIcon, ImagePlusIcon, MoreVerticalIcon, RotateCcwIcon, SparklesIcon, TrashIcon } from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod"
import { Suspense, useState } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";
import {  snakeCaseToTitle } from "@/lib/utils";

import { VideoPlayer } from "@/modules/videos/ui/components/videoPlayer";
import Link from "next/link";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constant";
import { ThumbnailUploadModal } from "../component/thumbnail-upload-modal";

import { APP_URL } from "@/constants";


interface FormSectionProps{
    videoId:string;
}
export const FormSection=({videoId}:FormSectionProps)=>{
    return(
       <Suspense fallback={<FormSectionSkeleton/>}>
        <ErrorBoundary fallback={<p>Error</p>}>
            <FormSectionSuspense videoId={videoId}/>
        </ErrorBoundary>
       </Suspense> 
    )
}
const FormSectionSkeleton=   ()=>{
    return(
        <div>
            Loading...
        </div>
    )
}
 const FormSectionSuspense=({videoId}:FormSectionProps)=>{
    const router=useRouter();
    const utlis=trpc.useUtils();
    const [thumbnailModalOpen,setThumbnailModalOpen]=useState(false);
    const [video]=trpc.studio.getOne.useSuspenseQuery({id:videoId})
    const [categories]=trpc.categories.getMany.useSuspenseQuery()

    const update=trpc.videos.update.useMutation({
        onError: () => {
            toast.error("Something went wrong");

        },
        onSuccess: () => {
         utlis.studio.getMany.invalidate()
         utlis.studio.getOne.invalidate({id:videoId})
         toast.success("Video Updated");


        },
    })
    const restoreThumbnail=trpc.videos.restoreThumbnail.useMutation({
      onError: () => {
          toast.error("Something went wrong");

      },
      onSuccess: () => {
       utlis.studio.getMany.invalidate()
       utlis.studio.getOne.invalidate({id:videoId})
       toast.success("Thumbnail Restored");
      },
  })
    const remove=trpc.videos.remove.useMutation({
      onError: () => {
          toast.error("Something went wrong");

      },
      onSuccess: () => {
       utlis.studio.getMany.invalidate();
       router.push('/studio');
       toast.success("Video removed");


      },
  })
  const revalidate=trpc.videos.revalidate.useMutation({
    onError: () => {
        toast.error("Something went wrong");

    },
    onSuccess: () => {
     utlis.studio.getMany.invalidate();
     utlis.studio.getOne.invalidate({id:videoId});
     router.push('/studio');
     toast.success("Video revalidated");


    },
})
    const form=useForm<z.infer<typeof videoUpdateSchema>>({
        resolver:zodResolver(videoUpdateSchema),
        defaultValues:video,
        categoryId: video.categoryId || "",
    visibility: video.visibility || "private"

    })
    const onSubmit= (data:z.infer<typeof videoUpdateSchema>)=>{
         update.mutate(data);

    }

    const fullUrl=`${APP_URL}/videos/${video.id}`
    const [isCopied,setIsCopied]=useState(false);
    const onCopy=()=>{
        navigator.clipboard.writeText(fullUrl).then(()=>{
            toast.success("URL copied to clipboard");
            setIsCopied(true);
            setTimeout(()=>{
                setIsCopied(false);
            },2000);
        }).catch(()=>{
            toast.error("Failed to copy URL");
        });

    }


    return(
      <>
      <ThumbnailUploadModal open={thumbnailModalOpen} onOpenChange={setThumbnailModalOpen} videoId={videoId}/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

           
    <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold ">Video Details</h1>
                <p className="text-sm text-muted-foreground">Manage your video details</p>
            </div>
            <div className="flex items-center gap-2">
                <Button typeof="submit" disabled={update.isPending}>Save</Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVerticalIcon/>

                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="flex flex-col shadow-lg rounded-md  hover:bg-gray-200 ">

                <DropdownMenuItem onClick={()=>remove.mutate({id:videoId})} >
                <TrashIcon className="size-4 mr-2 mt-1 "/>
                Delete

                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>revalidate.mutate({id:videoId})} >
                <RotateCcwIcon className="size-4 mr-2 mt-1 "/>
                Revalidate

                </DropdownMenuItem>


                    
                </DropdownMenuContent>
               
            
            </DropdownMenu>
            </div>
           
            
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
                <div className="space-y-8 lg:col-span-3">
                <FormField 
                control={form.control}
                name="title"
                render={({field})=>(
                    <FormItem >
                    <FormLabel>
                        Title:
                    {/*TODO: add ai Feature */}
                    </FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Add a title to you video"/>

                    </FormControl>
                    <FormMessage/>


                    </FormItem>
    )}
                />
                     <FormField 
                control={form.control}
                name="description"
                render={({field})=>(
                    <FormItem >
                    <FormLabel>
                        Description:
                    {/*TODO: add ai Feature */}
                    </FormLabel>
                    <FormControl>
                        <Textarea {...field} value={field.value??""} placeholder="Add a description to your video" rows={10} className="resize-none pr-10"/>

                    </FormControl>
                    <FormMessage/>


                    </FormItem>
    )}
  />

<FormField
  name="thumbnailUrl" 
  control={form.control} 
  render={() => (
    <FormItem>
      <FormLabel>Thumbnail</FormLabel>
      <FormControl>
        <div className="relative p-0.5 border border-dashed border-neutral-400 h-[84px] w-[153px] group">
          <Image
            fill
            alt="Thumbnail"
            src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
            className="object-cover"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size='icon' className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7">
                <MoreVerticalIcon className="size-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
            <DropdownMenuItem onClick={()=>setThumbnailModalOpen(true)}>
              <ImagePlusIcon className="size-4 mr-1"/>
              Change
            </DropdownMenuItem>
             <DropdownMenuItem >
              <SparklesIcon className="size-4 mr-1"/>
              AI-Generated
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>restoreThumbnail.mutate({id:videoId})}>
              <RotateCcwIcon className="size-4 mr-1"/>
              Restore
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </FormControl>
    </FormItem>
  )} 
/>


<FormField
  control={form.control}
  name="categoryId"  // Changed from "category" to "categoryId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                </div>
                <div className="flex flex-col gap-y-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
                <div className="aspect-video overflow-hidden relative">
                    <VideoPlayer playbackId={video.muxPlaybackId} thumbnailUrl={video.thumbnailUrl}/>

                </div>
                <div className="p-4 flex flex-col gap-y-6">
                    <div className="flex justify-between items-center gap-x-2">
                        <div className="flex flex-col gap-y-1">
                            <p className="text-muted-foreground text-sm ">
                                VideoLink
                            </p>
                            <div className="flex items-center gap-x-2">
                                <Link href={`/videos/${video.id}`}>

                                    <p className="text-blue-500 hover:text-blue-600 line-clamp-1 text-sm">
                                        <span>{ fullUrl }</span>
                                    </p>


                                </Link>
                                <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={onCopy} disabled={false}>
                                  {isCopied ? <CopyCheckIcon/>:<CopyIcon/>  }  
                                </Button>

                            </div>

                        </div>
                   
                    </div>
                    <div className="flex justify-between items-center ">
                        <div className="flex flex-col gap-y-1">
                            <p className="text-muted-foreground text-xs">
                                Video Status
                            </p>
                            <p className="text-sm">
                                {snakeCaseToTitle(video.muxStatus || "preparing")}
                            </p>
                        </div>

                    </div>
                    <div className="flex justify-between items-center ">
                        <div className="flex flex-col gap-y-1">
                            <p className="text-muted-foreground text-xs">
                                Audio Status
                            </p>
                            <p className="text-sm">
                                {snakeCaseToTitle(video.muxTrackStatus || "no_audio")}
                            </p>
                        </div>

                    </div>
                </div>

            </div>
            <FormField
  control={form.control}
  name="visibility" // Fixed typo in field name (was "visibiltity")
  render={({ field }) => (
    <FormItem>
      <FormLabel>Visibility</FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                </div>
            </div>
        </form>
        </Form>
        </>
    )
  
}
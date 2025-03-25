"use client"

import { Button } from "@/components/ui/button";
import { videoUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { P, Z } from "@upstash/redis/zmscore-Dc6Llqgr";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod"
import { Suspense } from "react";
import { Dropdown } from "react-day-picker";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectValue } from "@radix-ui/react-select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { VideoThumbnail } from "@/modules/videos/ui/components/videoThumbnail";
import { VideoPlayer } from "@/modules/videos/ui/components/videoPlayer";


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
    const utlis=trpc.useUtils();
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
    
    const form=useForm<z.infer<typeof videoUpdateSchema>>({
        resolver:zodResolver(videoUpdateSchema),
        defaultValues:video,

    })
    const onSubmit= (data:z.infer<typeof videoUpdateSchema>)=>{
         update.mutate(data);

    }
    return(
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
                <DropdownMenuContent align="end" className="flex shadow-lg rounded-md p-2 px-4 hover:bg-gray-200">

                    <TrashIcon className="size-4 mr-2 mt-1 "/>
                Delete
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
                {/* TODO:Add thumbnail field here */}
                <FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <FormControl>
        <div className="relative">
          <select
            {...field}
            className={cn (
              "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "appearance-none", // Remove default arrow
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1em",
            }}
          >
            <option value="" disabled className="text-muted-foreground">
              Select a Category
            </option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="px-4 py-2 hover:bg-accent focus:bg-accent"
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
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

            </div>
                </div>
            </div>
        </form>
        </Form>
    
    )

}
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { commentInsertSchema, users } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";


interface commentFormProps{
    videoId:string,
    parentId?:string,
    onSuccess?:()=>void,
    onCancel?:()=>void,
    variant:"comment"|"reply",

}
export const CommentForm=({videoId,onSuccess,parentId,onCancel,variant="comment"}:commentFormProps)=>{
    const {user}=useUser();
    const clerk=useClerk()
    const utils=trpc.useUtils()
    const handleCancel=()=>{
        form.reset();
        onCancel?.();
    }
    const create=trpc.comments.create.useMutation({
        onSuccess:()=>{
            utils.comments.getMany.invalidate({videoId});
            utils.comments.getMany.invalidate({videoId,parentId});
            form.reset();
            toast.success("Comment Added");
            onSuccess?.();
        },
        onError:(error)=>{
            if(error.data?.code==="UNAUTHORIZED"){
                clerk.openSignIn();
            }
            toast.error("Something went wrong");

        }
    });
    const form=useForm<z.infer<typeof commentInsertSchema>>({
        resolver:zodResolver(commentInsertSchema.omit({userId:true})),
        defaultValues:{
            parentId:parentId,
            videoId:videoId,
            value:"",
        }

    })
    const handleSubmit=(values:z.infer<typeof commentInsertSchema>)=>{
        create.mutate(values)
    }
    return (
        <Form {...form}>

       <form className="flex gap-4 group"
       onSubmit={form.handleSubmit(handleSubmit)}>
        <UserAvatar
        size="lg"
        imageUrl={user?.imageUrl || '/user-placeholder.svg'}
        name={user?.username|| "User"}
          />
          <div className="flex-1">
            <FormField name="value" control={form.control} render={({field})=>(
                <FormItem>
                    <FormControl>
                    <Textarea {...field}  placeholder={variant==="reply"?"Reply to this comment...":"Add a comment..."} className="resize-none bg-transparent overflow-hidden min-h-0"/>
                    
                    </FormControl>
                    <FormMessage/>
                </FormItem>

            )}/>
          <div className="justify-end mt-2 gap-2 flex">
            {
                onCancel &&(
                    <Button variant="ghost" type="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                )
            }
            <Button type="submit" size="sm" disabled={create.isPending} onClick={()=>{}}>
            {variant=="reply"?"Reply":"Comment"}
            </Button>

          </div>
          </div>

       </form>
       </Form>

    )
}
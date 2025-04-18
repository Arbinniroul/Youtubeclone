import { db } from "@/db";
import { users, videos, videoUpdateSchema, videoViews } from "@/db/schema";
import { mux } from "@/lib/musk";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { uptime } from "process";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const VideosRouter = createTRPCRouter({
  getOne:baseProcedure
  .input(z.object({id:z.string().uuid()}))
  .query(async({input})=>{
    const [existingVideo]=await db
    .select({
      title:videos.title,
      ...getTableColumns(videos),
      user:{...getTableColumns(users)},
      viewCount:db.$count(videoViews,eq(videoViews.videoId,videos.id))
    })
    .from(videos)
    .where(eq(videos.id,input.id))
    .innerJoin(users,eq(videos.userId,users.id))


    if(!existingVideo) throw  new TRPCError({code:"NOT_FOUND"})
   return existingVideo;

  }),
  restoreThumbnail:protectedProcedure.
  input(z.object({id:z.string().uuid()}))
  .mutation(async({ctx,input})=>{
    const {id:userId}=ctx.user;
    const [existingVideo]=await db
    .select()
    .from(videos)
    .where(and(eq(
      videos.id,input.id
    ),eq(videos.userId,userId)))

  if(!existingVideo) {
    throw new TRPCError({code:"NOT_FOUND"})
  }
  if(existingVideo.thumbnailKey){
    const utapi=new UTApi();
            
    await utapi.deleteFiles(existingVideo.thumbnailKey);
    await db
    .update(videos)
    .set({thumbnailKey:null,thumbnailUrl:null})
    .where(
        and(
            eq(videos.id,input.id),
            eq(videos.userId,userId)
        )

    )
  }
  if(!existingVideo.muxPlaybackId){
    throw new TRPCError({code:"BAD_REQUEST"});
    
  }
  const tempThumbnailUrl=`https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
const utapi=new UTApi();
const uploadedThumbnail=await utapi.uploadFilesFromUrl(tempThumbnailUrl);

if(!uploadedThumbnail.data){
  throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
}
const {key:thumbnailKey,url:thumbnailUrl}=uploadedThumbnail.data;

  const [updatedVideo]=await db
  .update(videos)
  .set({thumbnailUrl,thumbnailKey})
  .where(and(
    eq(videos.id,input.id),
    eq(videos.userId,userId)
  ))
  .returning()
 
  return updatedVideo;

  })
  ,
  remove:protectedProcedure.
  input(z.object({id:z.string().uuid()}))
  .mutation(async({ctx,input})=>{
    const {id:userID}=ctx.user;
    const [removedVideo]=await db.delete(videos).where(and(eq(videos.id,input.id),eq(videos.userId,userID))).returning()
    if(!removedVideo){
      throw new TRPCError({code:'NOT_FOUND'});
    }
    return removedVideo;
  })
  ,
  update:protectedProcedure.
  input(videoUpdateSchema)
  .mutation(async({ctx,input})=>{
    const {id:userId}=ctx.user;
    if(!input.id){
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Video ID is required"
      });
    }
    const [updatedVideo]=await db
    .update(videos)
    .set({
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      visibiltity:input.visibiltity,
      updatedAt:new Date()
              
    })
    .where(and(
      eq(videos.id,input.id),
      eq(videos.userId, userId),
    ))
    .returning();
    if (!updatedVideo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Video not found or you do not have access to update it",
      });
    }

return updatedVideo;
}),
  createVideo: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }

    console.log("User ID:", userId);
    console.log("Mux instance:", mux); // Ensure mux is initialized

    let upload;
    try {
      upload = await mux.video.uploads.create({
        new_asset_settings: {
           passthrough:userId,
          playback_policy: ["public"],
        },
        cors_origin: "*", // TODO: Set your production URL here
      });

      console.log("Mux Upload Response:", upload);
    } catch (error) {
      console.error("Error creating Mux upload:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Mux upload creation failed. Check API keys and configuration.",
      });
    }

    try {
      const [video] = await db
        .insert(videos)
        .values({
          userId,
          title: "Untitled",
          muxStatus:"waiting",
          muxUploadId:upload.id

        })
        .returning({ id: videos.id });

      console.log("Video Created:", video);
      return { videoId: video.id, url: upload.url };
    } catch (error) {
      console.error("Error creating video in database:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create video in the database.",
      });
    }
  }),
});
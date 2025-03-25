import { db } from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/musk";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const VideosRouter = createTRPCRouter({
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
      visibility:input.visibility,
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
import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/musk";
import {  createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const VideosRouter = createTRPCRouter({
  createVideo: protectedProcedure.mutation(async ({ ctx }) => {
    console.log("Mutation called"); 

    if (!ctx.user) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }
    const {id:userId}=ctx.user;
    const upload=await mux.video.uploads.create({
      new_asset_settings:{
        passthrough:userId,
        playback_policy:['public'],
        mp4_support:"standard",
      },
      cors_origin:"*"//TODO in production set to you URL
    })

    console.log("User ID:", ctx.user.id);

    try {
      const [video] = await db
        .insert(videos)
        .values({
          userId: ctx.user.id,
          title: "Untitled",
        })
        .returning({ id: videos.id });

      console.log("Video Created:", video);
      return { videoId: video.id,url:upload.url };
    } catch (error) {
      console.error("Error creating video:", error);
      throw new Error("Failed to create video");
    }
  }),
});


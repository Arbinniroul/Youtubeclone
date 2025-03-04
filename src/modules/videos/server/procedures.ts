import { db } from "@/db";
import { videos } from "@/db/schema";
import {  createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const VideosRouter = createTRPCRouter({
  createVideo: protectedProcedure.mutation(async ({ ctx }) => {
    console.log("Mutation called"); // Check if mutation runs

    if (!ctx.user) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

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
      return { videoId: video.id };
    } catch (error) {
      console.error("Error creating video:", error);
      throw new Error("Failed to create video");
    }
  }),
});


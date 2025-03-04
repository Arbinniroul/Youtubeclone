import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/musk";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const VideosRouter = createTRPCRouter({
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
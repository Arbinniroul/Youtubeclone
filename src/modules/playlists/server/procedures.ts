import { db } from "@/db";
import {  users, videoReactions, videos, videoViews } from "@/db/schema";

import {  createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";

import { z } from "zod";

export const PlaylistsRouter = createTRPCRouter({
  getLiked: protectedProcedure
  .input(
    z.object({
      

      cursor: z.object({
        id: z.string().uuid(),
        likedAt: z.date(),
      }).nullish(),
      limit: z.number().int().min(1).max(100),
    }),
  )
  .query(async ({ input,ctx }) => {
    const {id:userId}=ctx.user;
    const {  cursor, limit } = input;
    const ViewerVideosReactions=db.$with("viewer_video_reactions").as(
      db
      .select({
        videoId:videoReactions.videoId,
        likedAt:videoReactions.updatedAt
      })
      .from(videoReactions)
      .where(and(eq(videoReactions.userId,userId),eq(videoReactions.type,"like")))
    )
    try {
      const data = await db
      .with(ViewerVideosReactions)
        .select({
          ...getTableColumns(videos),
          user: users,
          likedAt:ViewerVideosReactions.likedAt,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          )
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(ViewerVideosReactions,eq(ViewerVideosReactions.videoId,videos.id))
        .where(
          and(
            eq(videos.visibility, "public"),

            cursor
              ? or(
                  lt(ViewerVideosReactions.likedAt, cursor?.likedAt ),
                  and(
                    eq(ViewerVideosReactions.likedAt, cursor.likedAt),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(ViewerVideosReactions.likedAt), desc(videos.id))
        .limit(limit + 1);

  
          const hasMore = data.length > limit;
          const items = hasMore ? data.slice(0, -1) : data;
          const lastItem = items[items.length - 1];
  
          const nextCursor = hasMore
            ? { id: lastItem.id, updatedAt: lastItem.likedAt }
            : null;
  
          return {
            items,
            nextCursor,
          };
        } catch (error) {
          console.error("Error fetching videos:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch videos",
          });
        }
      }),
 
  getHistory: protectedProcedure
  .input(
    z.object({
      

      cursor: z.object({
        id: z.string().uuid(),
        viewedAt: z.date(),
      }).nullish(),
      limit: z.number().int().min(1).max(100),
    }),
  )
  .query(async ({ input,ctx }) => {
    const {id:userId}=ctx.user;
    const {  cursor, limit } = input;
    const ViewerVideosViews=db.$with("viewer_video_views").as(
      db
      .select({
        videoId:videoViews.videoId,
        viewedAt:videoViews.updatedAt
      })
      .from(videoViews)
      .where(eq(videoViews.userId,userId))
    )
    try {
      const data = await db
      .with(ViewerVideosViews)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewedAt:ViewerVideosViews.viewedAt,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          )
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(ViewerVideosViews,eq(ViewerVideosViews.videoId,videos.id))
        .where(
          and(
            eq(videos.visibility, "public"),

            cursor
              ? or(
                  lt(ViewerVideosViews.viewedAt, cursor?.viewedAt ),
                  and(
                    eq(ViewerVideosViews.viewedAt, cursor.viewedAt),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(ViewerVideosViews.viewedAt), desc(videos.id))
        .limit(limit + 1);

  
          const hasMore = data.length > limit;
          const items = hasMore ? data.slice(0, -1) : data;
          const lastItem = items[items.length - 1];
  
          const nextCursor = hasMore
            ? { id: lastItem.id, updatedAt: lastItem.viewedAt }
            : null;
  
          return {
            items,
            nextCursor,
          };
        } catch (error) {
          console.error("Error fetching videos:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch videos",
          });
        }
      }),
 
});
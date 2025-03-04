import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and, or, lt, desc } from "drizzle-orm";
import { z } from "zod";

export const studioRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().int().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      try {
        // Fetch videos with cursor-based pagination
        const data = await db
          .select()
          .from(videos)
          .where(
            and(
              eq(videos.userId, userId), // Filter by user ID
              cursor
                ? or(
                    lt(videos.updatedAt, cursor?.updatedAt ?? new Date()), // Fetch rows before the cursor
                    and(
                      eq(videos.updatedAt, cursor.updatedAt),
                      lt(videos.id, cursor.id),
                    ),
                  )
                : undefined, // No cursor, fetch from the beginning
            ),
          )
          .orderBy(desc(videos.updatedAt), desc(videos.id)) // Order by updatedAt and id
          .limit(limit + 1); // Fetch one extra row to check if there are more items

        // Determine if there are more items to fetch
        const hasMore = data.length > limit;
        const items = hasMore ? data.slice(0, -1) : data; // Remove the extra row
        const lastItem = items[items.length - 1];

        // Calculate the next cursor
        const nextCursor = hasMore
          ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
          : null;

        // Retu[rn the expected structure for useInfiniteQuery
        return {
          items,
          nextCursor,
        }
      } catch (error) {
        // Handle errors
        console.error("Error fetching videos:", error);
        throw new Error("Failed to fetch videos");
      }
    }),
});
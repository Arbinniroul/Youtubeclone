import { db } from "@/db";
import { subscriptions, users, videoReactions, videos, videoUpdateSchema, videoViews } from "@/db/schema";
import { mux } from "@/lib/musk";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, inArray, isNotNull, lt, or } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const VideosRouter = createTRPCRouter({
  getManySubscribed: protectedProcedure
  .input(
    z.object({
      cursor: z.object({
        id: z.string().uuid(),
        updatedAt: z.date(),
      }).nullish(),
      limit: z.number().int().min(1).max(100),
    }),
  )
  .query(async ({ input,ctx }) => {
    const { cursor, limit } = input;
   const {id:userId}=ctx.user;
   const viewerSubscriptions=db.$with("subscription").as(
    db.
    select({userId:subscriptions.creatorId})
    .from(subscriptions)
    .where(eq(subscriptions.viewerId,userId))
   )
   

    try {
      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
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
        .innerJoin(viewerSubscriptions,eq(viewerSubscriptions.userId,users.id))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor?.updatedAt ?? new Date()),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

  
          const hasMore = data.length > limit;
          const items = hasMore ? data.slice(0, -1) : data;
          const lastItem = items[items.length - 1];
  
          const nextCursor = hasMore
            ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
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
  getTrending: baseProcedure
  .input(
    z.object({
      cursor: z.object({
        id: z.string().uuid(),
        viewCount:z.number(),

      }).nullish(),
      limit: z.number().int().min(1).max(100),
    }),
  )
  .query(async ({ input }) => {
    const {  cursor, limit } = input;

    const videoCountSubQuery=db.$count(
      videoViews,
      eq(videoViews.videoId,videos.id),

    )

    try {
      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount:videoCountSubQuery,
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
        .where(
          and(
            eq(videos.visibility, "public"),
 
            cursor
              ? or(
                  lt(videoCountSubQuery, cursor.viewCount ),
                  and(
                    eq(videoCountSubQuery, cursor.viewCount),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(videoCountSubQuery), desc(videos.id))
        .limit(limit + 1);

  
          const hasMore = data.length > limit;
          const items = hasMore ? data.slice(0, -1) : data;
          const lastItem = items[items.length - 1];
  
          const nextCursor = hasMore
            ? { id: lastItem.id, viewCount: lastItem.viewCount }
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
  getMany: baseProcedure
  .input(
    z.object({
      
      categoryId: z.string().uuid().nullish(),
      cursor: z.object({
        id: z.string().uuid(),
        updatedAt: z.date(),
      }).nullish(),
      limit: z.number().int().min(1).max(100),
    }),
  )
  .query(async ({ input }) => {
    const { categoryId, cursor, limit } = input;

    try {
      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
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
        .where(
          and(
            eq(videos.visibility, "public"),
            categoryId ? eq(videos.categoryId, categoryId) : undefined,
            cursor
              ? or(
                  lt(videos.updatedAt, cursor?.updatedAt ?? new Date()),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

  
          const hasMore = data.length > limit;
          const items = hasMore ? data.slice(0, -1) : data;
          const lastItem = items[items.length - 1];
  
          const nextCursor = hasMore
            ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
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
  getOne:baseProcedure
  .input(z.object({id:z.string().uuid()}))
  .query(async({input,ctx})=>{

    const {clerkUserId}=ctx;
    let userId;
   
    const [user]=await db
    .select()
    .from(users)
    .where(inArray(users.clerkId,clerkUserId?[clerkUserId]:[]))
    if(user){
      userId=user.id;
    }
    const viewerReactions=db.$with("video_reactions").as(
      db
      .select({
        videoId:videoReactions.videoId,
        type:videoReactions.type
      })
      .from(videoReactions)
      .where(inArray(videoReactions.userId,userId?[userId]:[]))
    );
    const viewerSubscriptions=db.$with("viewer_subscriptions").as(
      db
      .select()
      .from(subscriptions)
      .where(inArray(subscriptions.viewerId, userId? [userId] : []))

    )
    const [existingVideo]=await db
    .with(viewerReactions,viewerSubscriptions)
    .select({
      title:videos.title,
      ...getTableColumns(videos),
      user:{...getTableColumns(users),
        subscriberCount:db.$count(subscriptions,eq(subscriptions.creatorId,users.id)),
       viewerSubscribed:isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean)

      },
      viewCount:db.$count(videoViews,eq(videoViews.videoId,videos.id)),
      likeCount:db.$count(videoReactions,
        and(eq(videoReactions.videoId,videos.id),
      eq(videoReactions.type,"like"))

      ),
      dislikeCount:db.$count(videoReactions,
        and(eq(videoReactions.videoId,videos.id),
      eq(videoReactions.type,"dislike"))

      )
      ,
      viewerReactions:videoReactions.type
    })
    .from(videos)
    .innerJoin(users,eq(videos.userId,users.id))
    .leftJoin(viewerReactions,eq(viewerReactions.videoId,videos.id))
    .leftJoin(viewerSubscriptions,eq(viewerSubscriptions.creatorId,users.id))
    .where(eq(videos.id,input.id))
  



    if(!existingVideo) throw  new TRPCError({code:"NOT_FOUND"})

   return existingVideo;

  }),
  revalidate:protectedProcedure.
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
  if(!existingVideo.muxUploadId){
    throw new TRPCError({code:"BAD_REQUEST"})
  }
  const upload=await mux.video.uploads.retrieve(
    existingVideo.muxUploadId
  )
if(!upload || !upload.asset_id){
  throw new TRPCError({code:"BAD_REQUEST"})
}
const asset=await mux.video.assets.retrieve(
  upload.asset_id
)
if(!asset){
  throw new TRPCError({code:"BAD_REQUEST"})
}
const playbackId=asset.playback_ids[0].id;
const duration=asset.duration ? Math.round(asset.duration * 1000) : 0;


const [updatedVideo]=await db
.update(videos)
.set({
  muxStatus:asset.status,
  muxPlaybackId:playbackId,
  muxAssetId:asset.id,
  duration,
})
.where(and(
  eq(videos.id,input.id),
  eq(videos.userId,userId)
))
.returning()

return updatedVideo;
  })


  ,
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
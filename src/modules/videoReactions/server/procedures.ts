import { db } from "@/db";
import { videoReactions} from "@/db/schema";
import { createTRPCRouter,protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoReactionRouter=createTRPCRouter({
    like:protectedProcedure
    .input(z.object({videoId:z.string().uuid()}))
    .mutation(async({input,ctx})=>{
        const {id:userId}=ctx.user;
        const {videoId}=input;
        
        const[existingVideoReactionsLike]=await db
        .select()
        .from(videoReactions)
        .where(
            and(eq(videoReactions.videoId,videoId),
            eq(videoReactions.userId,userId),
            eq(videoReactions.type,"like")
        )
        );
        if(existingVideoReactionsLike){
                const [deletedVieweReaction]=await db
                .delete(videoReactions)
                .where(
                    and(
                        eq(videoReactions.userId,userId),
                        eq(videoReactions.videoId,videoId)
                    )
                )
                .returning();

                return deletedVieweReaction
        }
        const[createdVideoReactions]=await db
        .insert(videoReactions)
        .values({userId,videoId,type:"like"})
        .onConflictDoUpdate({
            target:[videoReactions.userId,videoReactions.videoId],
            set:{
                type:'like'
            }
        })
        .returning()

        return createdVideoReactions;

    }),
    dislike:protectedProcedure
    .input(z.object({videoId:z.string().uuid()}))
    .mutation(async({input,ctx})=>{
        const {id:userId}=ctx.user;
        const {videoId}=input;
        
        const[existingVideoReactionsDislike]=await db
        .select()
        .from(videoReactions)
        .where(
            and(eq(videoReactions.videoId,videoId),
            eq(videoReactions.userId,userId),
            eq(videoReactions.type,"like")
        )
        );
        if(existingVideoReactionsDislike){
                const [deletedVieweReaction]=await db
                .delete(videoReactions)
                .where(
                    and(
                        eq(videoReactions.userId,userId),
                        eq(videoReactions.videoId,videoId)
                    )
                )
                .returning();

                return deletedVieweReaction
        }
        const[createdVideoReactions]=await db
        .insert(videoReactions)
        .values({userId,videoId,type:"dislike"})
        .onConflictDoUpdate({
            target:[videoReactions.userId,videoReactions.videoId],
            set:{
                type:'dislike'
            }
        })
        .returning()

        return createdVideoReactions;

    })
})

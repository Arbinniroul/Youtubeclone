import { db } from "@/db";
import { commentReactions} from "@/db/schema";
import { createTRPCRouter,protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionRouter=createTRPCRouter({
    like:protectedProcedure
    .input(z.object({commentId:z.string().uuid()}))
    .mutation(async({input,ctx})=>{
        const {id:userId}=ctx.user;
        const {commentId}=input;
        
        const[existingCommentReactionsLike]=await db
        .select()
        .from(commentReactions)
        .where(
            and(eq(commentReactions.commentId,commentId),
            eq(commentReactions.userId,userId),
            eq(commentReactions.type,"like")
        )
        );
        if(existingCommentReactionsLike){
                const [deletedVieweReaction]=await db
                .delete(commentReactions)
                .where(
                    and(
                        eq(commentReactions.userId,userId),
                        eq(commentReactions.commentId,commentId)
                    )
                )
                .returning();

                return deletedVieweReaction
        }
        const[createdCommentReactions]=await db
        .insert(commentReactions)
        .values({userId,commentId,type:"like"})
        .onConflictDoUpdate({
            target:[commentReactions.userId,commentReactions.commentId],
            set:{
                type:'like'
            }
        })
        .returning()

        return createdCommentReactions;

    }),
    dislike:protectedProcedure
    .input(z.object({commentId:z.string().uuid()}))
    .mutation(async({input,ctx})=>{
        const {id:userId}=ctx.user;
        const {commentId}=input;
        
        const[existingCommentReactionsLike]=await db
        .select()
        .from(commentReactions)
        .where(
            and(eq(commentReactions.commentId,commentId),
            eq(commentReactions.userId,userId),
            eq(commentReactions.type,"dislike")
        )
        );
        if(existingCommentReactionsLike){
                const [deletedVieweReaction]=await db
                .delete(commentReactions)
                .where(
                    and(
                        eq(commentReactions.userId,userId),
                        eq(commentReactions.commentId,commentId)
                    )
                )
                .returning();

                return deletedVieweReaction
        }
        const[createdCommentReactions]=await db
        .insert(commentReactions)
        .values({userId,commentId,type:"dislike"})
        .onConflictDoUpdate({
            target:[commentReactions.userId,commentReactions.commentId],
            set:{
                type:'dislike'
            }
        })
        .returning()

        return createdCommentReactions;

    }),
})

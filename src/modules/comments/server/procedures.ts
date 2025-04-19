import { db } from "@/db";
import {  commentReactions, comments, users, videos } from "@/db/schema";
import { baseProcedure, createTRPCRouter,protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, inArray, lt, or } from "drizzle-orm";
import { AudioWaveformIcon } from "lucide-react";
import { comment } from "postcss";

import { z } from "zod";

export const commentsRouter=createTRPCRouter({
    create:protectedProcedure
    .input(
        z.object({
            videoId:z.string().uuid(),
            value:z.string(),
        })
    )
    .mutation(async({input,ctx})=>{
        const {id:userId}=ctx.user;
        const {videoId,value}=input;
        
        const[createdComments]=await db
        .insert(comments)
        .values({userId,videoId,value})
        .returning();

        return createdComments
      
    }),
    remove:protectedProcedure
    .input(
        z.object({
            id:z.string().uuid(),
            
        })
    )
    .mutation(async({input,ctx})=>{
        const {id:userId}=ctx.user;
        const {id}=input;
        
        const[deletedComments]=await db
        .delete(comments)
        .where(and(eq(comments.userId,userId),eq(comments.id,id)))
        .returning();
    
        if(!deletedComments){
            throw  new TRPCError({code:"NOT_FOUND"})
        }
        return deletedComments
      
    }),
    getMany:baseProcedure.input(z.object({
        videoId:z.string().uuid(),cursor:z.object({
            id:z.string().uuid(),
            updatedAt:z.date(),
        }).nullish(),
        limit:z.number().min(1).max(100)
    }))
    .query(async({input,ctx})=>{
        const {videoId,cursor,limit}=input;
        const {clerkUserId}=ctx;
        let userId;
        const [user]=await db
        .select()
        .from(users)
        .where(inArray(users.clerkId,clerkUserId?[clerkUserId]:[]))

        if(user){
            userId=user.id;
        }
        const viewerReactions=db.$with("viewer_reactions").as(
            db
            .select({
                commentId:commentReactions.commentId,
                type:commentReactions.type
            })
            .from(commentReactions)
            .where(inArray(commentReactions.userId,userId?[userId]:[]))
        )
        const [totalData,data]=await Promise.all(
            [
                await db
                .select({
                    count:count()
                })
                .from(comments)
                .where(eq(comments.videoId,videoId)),

                await db
                .with(viewerReactions)
        .select({
            ...getTableColumns(comments),
            user:users,
            viewerReactions:viewerReactions.type,
            likeCount:db.$count(
                commentReactions,and(
                    eq(commentReactions.type,"like"),
                    eq(commentReactions.commentId,comments.id))

            ),
            dislikeCount:db.$count(
                commentReactions,and(
                    eq(commentReactions.type,"dislike"),
                    eq(commentReactions.commentId,comments.id))

            )

        })
        .from(comments)
        .where(and(
            eq(comments.videoId,videoId),
             cursor
            ? or(
                lt(comments.updatedAt, cursor.updatedAt ), 
                and(
                eq(comments.updatedAt, cursor.updatedAt),
                lt(comments.id, cursor.id),
                ),
            )
            : undefined, 
))
        .innerJoin(users,eq(comments.userId,users.id))
        .leftJoin(viewerReactions,eq(comments.id,viewerReactions.commentId))
        .orderBy(desc(comments.updatedAt),desc(comments.id))
        .limit(limit+1)
                

            
            ]
        )
      

    
        const hasMore = data.length > limit;
        const items = hasMore ? data.slice(0, -1) : data; 
        const lastItem = items[items.length - 1];

   
        const nextCursor = hasMore
          ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
          : null;

       
        return {totalCount:totalData[0].count,items,nextCursor};

    })
})

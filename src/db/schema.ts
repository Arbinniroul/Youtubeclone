import { pgTable, text, uuid, timestamp, uniqueIndex, integer, pgEnum,primaryKey} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { foreignKey } from "drizzle-orm/mysql-core";
export const reactionType=pgEnum("reaction_type",["like","dislike"]);



export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    clerkIdIdx: uniqueIndex("clerk_id_idx").on(t.clerkId),
}));

export const videoVisibility=pgEnum("video_visibility",[
    "private",
    "public",
])

export const videos = pgTable("videos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    muxStatus:text("mux_status"),
    muxAssetId:text("mux_asset_id").unique(),
    muxUploadId:text("mux_upload_id").unique(),
    muxPlaybackId:text("mux_playback_id").unique(),
    muxTrackId:text("mux_track_id").unique(),
    muxTrackStatus:text("mux_track_status"),
    thumbnailUrl:text("thumbnail_url"),
    thumbnailKey:text("thumbnail_key"),
    previewUrl:text("preview_url"),
    previewKey:text("preview_key"),
    duration:integer("duration").default(0).notNull(),
    visibility: videoVisibility("visibility").default("private").notNull(),
    userId: uuid("user_id").references(() => users.id, { 
        onDelete: "cascade",
        
    }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete: "set null",
    }), 
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    nameIdx: uniqueIndex("name_idx").on(t.name), 
}));
export const videoInsertSchema=createInsertSchema(videos);
export const videoUpdateSchema=createUpdateSchema(videos);
export const videoSelectSchema=createSelectSchema(videos);


export const userRelations = relations(users, ({ many }) => ({
    videos: many(videos),
    videoViews:many(videoViews),
    videoReactions:many(videoReactions),
    subscription:many(subscriptions,{
        relationName:"subscriptions_viewer_id_fkey",

    }),
    subscribers:many(subscriptions,{
        relationName:"subscriptions_creator_id_fkey"
    }),
    comments:many(comments),
    commentReactions:many(commentReactions)
}));

export const subscriptions=pgTable("subscription",{
    viewerId:uuid("viewer_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    creatorId:uuid("creator_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),


},(t)=>[
    primaryKey({
        name:"subscriptions_pk",
        columns:[t.viewerId,t.createdAt]
    })
])
export const subscriptionRelation=relations(subscriptions,({one})=>({
    viewer:one(users,{
        fields:[subscriptions.viewerId],
        references:[users.id],
        relationName:"subscriptions_viewer_id_fkey",

    }),
    creator:one(users,{
        fields:[subscriptions.creatorId],
        references:[users.id],
        relationName:"subscriptions_creator_id_fkey",

    }),
}))
export const videosRelations = relations(videos, ({ one,many }) => ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id],
    }),
    views:many(videoViews),
    reactions:many(videoReactions),
    comments:many(comments)
}));

export const categoryRelations = relations(categories, ({ many }) => ({
    videos: many(videos),
}));
export const comments=pgTable("comments",{
    id:uuid("id").primaryKey().defaultRandom(),
    userId:uuid("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    parentId:uuid("parent_id"),
    videoId:uuid("video_id").references(()=>videos.id,{onDelete:"cascade"}).notNull(),
    value:text("value").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

},(t)=>{
    return[
        foreignKey({
            columns:[t.parentId],
            foreignColumns:[t.id],
            name:"comments_parent_id_fkey)",

        })
        .onDelete("cascade")
    ]
})

export const commentRelations=relations(comments,({one,many})=>({
    user:one(users,{
        fields:[comments.userId],
        references:[users.id],

    }),
    video:one(videos,{
        fields:[comments.videoId],
        references:[videos.id],

    }),
    parent:one(comments,{
        fields:[comments.parentId],
        references:[comments.id],
        relationName:"comments_parent_id_fkey",

    }),
    replies:many(comments,{
        relationName:"comments_parent_id_fkey",
    }),

    reactions:many(commentReactions)
}))
export const commentSelectSchmea=createSelectSchema(comments);
export const commentInsertSchema=createInsertSchema(comments);
export const commentUpdateSchema=createUpdateSchema(comments);

export const commentReactions=pgTable("comment_reactions",{
    userId:uuid("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    commentId:uuid("comment_id").references(()=>comments.id,{onDelete:"cascade"}).notNull(),
    type:reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
},(t)=>[
    primaryKey({
    name:"comment_reactions_pk",
    columns:[t.userId,t.commentId],
})
])
export const commentReactionsRelation=relations(commentReactions,({one})=>({
    user:one(users,{
        fields:[commentReactions.userId],
        references:[users.id]
    }),
    video:one(comments,{
        fields:[commentReactions.commentId],
        references:[comments.id]
    })
}))
export const videoViews=pgTable("video_views",{
    userId:uuid("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    videoId:uuid("video_id").references(()=>videos.id,{onDelete:"cascade"}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),


},(t)=>[
    primaryKey({
    name:"video_views_pk",
    columns:[t.userId,t.videoId],
})
])

export const videoViewsRelation=relations(videoViews,({one})=>({
    user:one(users,{
        fields:[videoViews.userId],
        references:[users.id]
    }),
    video:one(videos,{
        fields:[videoViews.videoId],
        references:[videos.id]
    })
}))
export const videoViewSelectSchmea=createSelectSchema(videos);
export const videoViewsInsertSchema=createInsertSchema(videos);
export const videoViewsUpdateSchema=createUpdateSchema(videos);


export const videoReactions=pgTable("video_reactions",{
    userId:uuid("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    videoId:uuid("video_id").references(()=>videos.id,{onDelete:"cascade"}).notNull(),
    type:reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),


},(t)=>[
    primaryKey({
    name:"video_reaction_pk",
    columns:[t.userId,t.videoId],
})
])
export const videoReactionsRelation=relations(videoReactions,({one})=>({
    user:one(users,{
        fields:[videoReactions.userId],
        references:[users.id]
    }),
    videos:one(videos,{
        fields:[videoReactions.videoId],
        references:[videos.id]
    })
}))

export const videoReactionSelectSchmea=createSelectSchema(videos);
export const videoReactionInsertSchema=createInsertSchema(videos);
export const videoReactionUpdateSchema=createUpdateSchema(videos);
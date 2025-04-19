import { CategoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedures';
import { VideosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/videoViews/server/procedures';
import { videoReactionRouter } from '@/modules/videoReactions/server/procedures';
import { subscribtionsRouter } from '@/modules/subscription/server/procedures';




export const appRouter = createTRPCRouter({
  

  studio: studioRouter,
  categories: CategoriesRouter,
  videos: VideosRouter,
  videoViews:videoViewsRouter,
  videoReactions:videoReactionRouter,
  subscriptions:subscribtionsRouter,

  
});


export type AppRouter = typeof appRouter;

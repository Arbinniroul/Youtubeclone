import { CategoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedures';
import { VideosRouter } from '@/modules/videos/server/procedures';


export const appRouter = createTRPCRouter({
  

  studio: studioRouter,
  categories: CategoriesRouter,
  videos: VideosRouter,

  
});


export type AppRouter = typeof appRouter;

import { CategoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedures';
import { VideosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/videoViews/server/procedures';
import { videoReactionRouter } from '@/modules/videoReactions/server/procedures';
import { subscribtionsRouter } from '@/modules/subscription/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionRouter } from '@/modules/commentReactions/server/procedures';
import { suggestionRouter } from '@/modules/suggestions/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';
import { PlaylistsRouter } from '@/modules/playlists/server/procedures';





export const appRouter = createTRPCRouter({
  

  studio: studioRouter,
  categories: CategoriesRouter,
  videos: VideosRouter,
  videoViews:videoViewsRouter,
  videoReactions:videoReactionRouter,
  subscriptions:subscribtionsRouter,
  comments:commentsRouter,
  commentReactions:commentReactionRouter,
  suggestion:suggestionRouter,
  search:searchRouter,
  playlists:PlaylistsRouter,


  
});


export type AppRouter = typeof appRouter;

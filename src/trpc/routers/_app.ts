import { CategoriesRouter } from '@/modules/categories/server/procedures';
import {  createTRPCRouter } from '../init';


export const appRouter = createTRPCRouter({
  categories:CategoriesRouter,
});

// Export the AppRouter type
export type AppRouter = typeof appRouter;
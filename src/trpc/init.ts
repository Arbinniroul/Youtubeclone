import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ratelimit } from '@/lib/ratelimit';

// Create the TRPC context
export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  if (!userId) return { clerkUserId: null, user: null }; 


  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);


  return { clerkUserId: userId, user };
});


export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Initialize tRPC with the context
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Create routers and caller factory
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// Protected procedure that ensures authentication and limits rate of requests
export const protectedProcedure = baseProcedure.use(async (opts) => {
  const { ctx } = opts;

  // Debugging log to check if context is set
  console.log("TRPC Context:", ctx);

  // If user is not authenticated, throw an error
  if (!ctx || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to access this resource' });
  }


  const { user } = ctx;
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You do not have access to this resource' });
  }


  const { success } = await ratelimit.limit(user.id);
  if (!success) {
    throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later' });
  }

  // Pass the user object to the next handler
  return opts.next({
    ctx: {
      ...ctx,
      user, // Attach the user to the context for the next procedures
    },
  });
});

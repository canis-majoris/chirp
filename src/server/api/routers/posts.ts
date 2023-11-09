import { clerkClient } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/dist/types/server';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
}

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string().emoji().min(1).max(280) }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.auth.userId;

      const { success } = await ratelimit.limit(authorId!);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      return await ctx.db.post.create({
        data: {
          content: input.content,
          authorId: authorId!,
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { authorId: ctx.auth.userId! },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.db.post.findMany({
        take: 100,
        orderBy: [{ createdAt: "desc" }]
      });

      const users = (
        await clerkClient.users.getUserList({
          userId: posts.map((post) => post.authorId),
          limit: 100,
        })
      ).map(filterUserForClient);

      return posts.map((post) => {
        const author = users.find((user) => user.id === post.authorId);

        if (!author) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not find author",
          });
        }

        return {
          post,
          author: users.find((user) => user.id === post.authorId),
        };
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: JSON.stringify(error),
      });
    }
  }),
});

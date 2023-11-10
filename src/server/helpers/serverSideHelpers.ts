import { createServerSideHelpers } from '@trpc/react-query/server';
import { db } from '~/server/db';
import { appRouter } from '../api/root';
import SuperJSON from 'superjson';

export const generatessHelper = () =>
    createServerSideHelpers({
        router: appRouter,
        ctx: {
            db,
            userId: null,
        },
        transformer: SuperJSON,
    });
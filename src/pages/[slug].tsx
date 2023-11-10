import Head from 'next/head';
import { type GetStaticProps, type NextPage } from 'next';
import { type WithLayout } from '~/types/global';
import MainLayout from '~/layouts/main';
import { api } from '~/utils/api';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import Image from 'next/image';

type SlugPageProps = {
    username: string;
}

const SlugPage: NextPage<SlugPageProps> & WithLayout = ({ username }) => {
    const { data } = api.profile.getUserByUsername.useQuery({
        username
    });

    if (!data) return <div>Something went wrong</div>;

    return (
        <>
            <Head>
                <title>{data.username}</title>
            </Head>
            <div>
                <div className='bg-slate-600 h-36 relative'>
                    <Image
                        src={data.profileImageUrl ?? ''}
                        alt={`${data.username}'s profile pic`}
                        width={128}
                        height={128}
                        className='absolute bottom-0 left-0 ml-4 -mb-16 rounded-full border-4 border-black bg-black'
                    />
                </div>
                <div className='h-[64px]' />
                <div className='p-4 text-2xl font-bold'>
                    @{data.username}
                </div>
                <div className='border-b border-slate-400' />
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: {
            db,
            userId: null,
        },
        transformer: superjson,
    });

    const slug = context.params?.slug;

    if (typeof slug !== "string") throw new Error("Slug is not a string");

    const username = slug.replace("@", "");

    await helpers.profile.getUserByUsername.prefetch({
        username
    });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            username,
        },
    };
};

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
}

SlugPage.layout = MainLayout;

export default SlugPage;
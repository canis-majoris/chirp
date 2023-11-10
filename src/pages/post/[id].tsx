import { type GetStaticProps, type NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '~/layouts/main';
import PostView from '~/modules/feed/PostView';
import { generatessHelper } from '~/server/helpers/serverSideHelpers';
import { type WithLayout } from '~/types/global';
import { api } from '~/utils/api';

type SinglePostPageProps = {
    id: string;
}

const SinglePostPage: NextPage<SinglePostPageProps> & WithLayout = ({ id }) => {
    const { data } = api.posts.getById.useQuery({
        id
    });

    if (!data) return <div>Post not found</div>;

    return (
        <>
            <Head>
                <title>{data.post.content} - @{data.author?.username}</title>
            </Head>
            <PostView {...data} />
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const helpers = generatessHelper();

    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("Incorrect post id");

    await helpers.posts.getById.prefetch({ id });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
    };
};

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
}

SinglePostPage.layout = MainLayout;

export default SinglePostPage;
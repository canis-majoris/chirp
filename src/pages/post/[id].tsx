import { type NextPage } from 'next';
import Head from 'next/head';
import { LoadingPage } from '~/components/loading';
import { api } from '~/utils/api';

const SinglePostPage: NextPage = () => {
    const { data, isLoading } = api.profile.getUserByUsername.useQuery({
        username: 'test'
    });

    if (isLoading) return <LoadingPage />;

    if (!data) return <div>Something went wrong</div>;

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <div>
                {data?.username}
            </div>
        </>
    );
};

export default SinglePostPage;
import { LoadingPage } from '~/components/loading';
import { api } from '~/utils/api';
import PostView from './PostView';

const Feed = () => {
    const { data, isLoading } = api.posts.getAll.useQuery();

    if (isLoading) return <LoadingPage />;

    if (!data) return <div>Something went wrong</div>;

    return (
        <div className='flex flex-col'>
            {data?.map((fullPost) => <PostView key={fullPost.post.id} {...fullPost} />)}
        </div>
    )
}

export default Feed;
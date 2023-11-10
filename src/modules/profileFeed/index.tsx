import { LoadingPage } from '~/components/loading';
import { api } from '~/utils/api';
import PostView from '../feed/PostView';

type ProfileFeedType = {
    userId: string;
}

const ProfileFeed = (props: ProfileFeedType) => {
    const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
        userId: props.userId
    });

    if (isLoading) return <LoadingPage />;

    if (!data || data.length === 0) return <div>user has not posted</div>;

    return (
        <div className='flex flex-col'>
            {data?.map((fullPost) => <PostView key={fullPost.post.id} {...fullPost} />)}
        </div>
    );
}

export default ProfileFeed;
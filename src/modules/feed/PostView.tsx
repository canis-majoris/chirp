import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type RouterOutputs } from '~/utils/api';
import Link from 'next/link';

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
    const { post, author } = props;

    return (
        <div className='p-4 border-b border-slate-400 flex gap-3'>
            <Image
                width={56}
                height={56}
                className='rounded-full'
                src={author!.profileImageUrl}
                alt='Profile Image'
            />
            <div className='flex flex-col'>
                <div className='flex text-slate-300 gap-1'>
                    {author?.username && (
                        <Link href={`/@${author.username}`}>
                            <span className='font-bold'>
                                {`@${author.username}`}
                            </span>
                        </Link>
                    )}
                    <Link href={`/post/${post.id}`}  className='flex gap-1'>
                        <span className='font-thin text-slate-400'>·</span>
                        <span className='font-thin text-slate-400'>{dayjs(post.createdAt).fromNow()}</span>
                    </Link>
                </div>
                <span className='text-2xl'>{post.content}</span>
            </div>
        </div>
    )
}

export default PostView;
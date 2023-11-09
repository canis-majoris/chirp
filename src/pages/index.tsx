import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import Head from "next/head";
// import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { RouterOutputs, api } from "~/utils/api";
import Image from 'next/image';
import { LoadingPage } from '~/components/Loading';
import { useState } from 'react';

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const [input, setInput] = useState('');
  const { user } = useUser();

  const ctx = api.useUtils();

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput('');
      void ctx.post.getAll.invalidate();
    }
  });

  if (!user) return null;

  return (
    < div className='flex gap-3 w-full'>
      <Image
        width={56}
        height={56}
        className='rounded-full'
        src={user.imageUrl}
        alt='Profile Image'
      />
      <input
        placeholder='Type some emojis!'
        className='bg-transparent grow outline-none'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />

      <button disabled={isPosting} onClick={() => mutate({ content: input })}>Submit</button>
    </div >
  )
}

type PostWithUser = RouterOutputs["post"]["getAll"][number];

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
            <span className='font-bold'>
              {`@${author.username}`}
            </span>
          )}
          <span className='font-thin text-slate-400'>·</span>
          <span className='font-thin text-slate-400'>{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span className='text-2xl'>{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className='flex flex-col'>
      {data?.map((fullPost) => <PostView key={fullPost.post.id} {...fullPost} />)}
    </div>
  )
}

export default function Home() {
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  api.post.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen flex justify-center">
        <div className='w-full md:max-w-2xl border-x border-slate-400'>
          <div className='border-b border-slate-400 p-4 flex align-middle'>
            {!isSignedIn && <SignInButton />}
            {!!isSignedIn && (
              <div className='flex justify-center grow'>
                <CreatePostWizard />
                <SignOutButton />
              </div>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
}

const a = {
  name: 'test',
  address: {
    city: 'Tbilisi',
    country: 'Georgia'
  }
}

const b = { ...a };

b.address.city = 'Batumi';

console.log(a);
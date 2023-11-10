import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { api } from "~/utils/api";
import MainLayout from '~/layouts/main';
import { CreatePostWizard, Feed } from '~/modules';
import Head from 'next/head';

const MainPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Chirp</title>
      </Head>
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
    </>
  );
}

MainPage.layout = MainLayout;

export default MainPage;
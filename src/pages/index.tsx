import { type ReactElement } from 'react';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { api } from "~/utils/api";
import MainLayout from '~/layouts/main';
import { CreatePostWizard, Feed } from '~/modules';

const MainPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
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

MainPage.getLayout = (page: ReactElement) => <MainLayout>{page}</MainLayout>;

export default MainPage;
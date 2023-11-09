import { type ReactNode, type ReactElement } from 'react';
import { type NextPage } from 'next';
import { type AppProps, type AppType } from "next/app";
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';

import { api } from "~/utils/api";

import "~/styles/globals.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {

  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <ClerkProvider {...pageProps}>
      <Toaster position='bottom-center' />
      {layout}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

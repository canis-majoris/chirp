import { type NextPage } from 'next';
import { type AppProps, type AppType } from "next/app";
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import { type WithLayout } from '~/types/global';

import { api } from "~/utils/api";

import "~/styles/globals.css";

type AppPropsWithLayout = AppProps & {
  Component: NextPage & WithLayout;
};

const MyApp: AppType = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {

  const LayoutComponent = Component.layout ?? (({ children }) => <>{children}</>);
  const layout = <LayoutComponent><Component {...pageProps} /></LayoutComponent>;

  return (
    <ClerkProvider {...pageProps}>
      <Toaster position='bottom-center' />
      {layout}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

import Head from 'next/head';
import { type PropsWithChildren } from 'react';

type MainLayoutProps = {
    title?: string;
    description?: string;
};

const MainLayout = ({ title, description, children }: PropsWithChildren<MainLayoutProps>) => {
    return (
        <>
            <Head>
                {title && <title>{title}</title>}
                {description && <meta name="description" content={description} />}
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen flex justify-center">
                <div className='w-full md:max-w-2xl border-x border-slate-400'>
                    {children}
                </div>
            </main>
        </>
    );
}

export default MainLayout;
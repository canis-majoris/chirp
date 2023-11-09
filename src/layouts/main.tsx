import Head from 'next/head';
import { type PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Head>
                <title>Chirp</title>
                <meta name="description" content="Chirp v0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="h-screen flex justify-center">
                <div className='w-full md:max-w-2xl border-x border-slate-400'>
                    {children}
                </div>
            </main>
        </>
    );
}

export default MainLayout;
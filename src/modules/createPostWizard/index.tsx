import { type SyntheticEvent, useCallback, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Button from '~/components/button';
import useDelay from '~/hooks/useDelay';
import { api } from '~/utils/api';
import { extractErrorMessageFromTRPC } from '~/utils/zod';

const CreatePostWizard = () => {
    const [input, setInput] = useState('');
    const { user } = useUser();

    const ctx = api.useUtils();

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
        onSuccess: () => {
            setInput('');
            void ctx.posts.getAll.invalidate();
        },
        onError: err => toast.error(extractErrorMessageFromTRPC(err))
    });

    const delayedButtonLoading = useDelay(isPosting, 250);

    const handlePostSubmit = useCallback((e: SyntheticEvent) => {
        e.preventDefault();
        mutate({ content: input });
    }, [input, mutate])

    if (!user) return null;

    return (
        <form className='flex gap-3 w-full' onSubmit={handlePostSubmit}>
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
            <Button
                type='submit'
                isLoading={delayedButtonLoading}
                disabled={isPosting}
            >
                Post
            </Button>
        </form >
    )
}

export default CreatePostWizard;
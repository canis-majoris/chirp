import type { TRPCClientErrorBase } from '@trpc/client';
import type { DefaultErrorData, DefaultErrorShape } from '@trpc/server/dist/error/formatter';
import type { typeToFlattenedError } from 'zod';

type Error = TRPCClientErrorBase<{
    data: {
        zodError: typeToFlattenedError<{ content: string[] }, string> | null;
    } & DefaultErrorData;
} & DefaultErrorShape>;

export const extractErrorMessageFromTRPC = (error: Error) =>
    error.data?.zodError?.fieldErrors?.content?.reduce((acc: string, curr: string) => `${acc} ${curr}`, '') ?? error.message;

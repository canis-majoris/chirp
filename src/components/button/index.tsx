import { type ComponentPropsWithoutRef } from 'react';
import { LoadingSpinner } from '../loading';

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
    isLoading?: boolean;
};

const Button = ({ children, isLoading, ...props }: ButtonProps) => {
    return (
        <button
            className={`px-4 py-2 rounded-md bg-slate-500 text-white flex items-center gap-2 ${isLoading && 'bg-slate-700'}`}
            disabled={isLoading}
            {...props}
        >
            {children}
            {isLoading && <LoadingSpinner size={20} />}
        </button>
    );
};

export default Button;
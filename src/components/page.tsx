import clsx from 'clsx';
import React from 'react';

export const Page = {
    Header: ({
        children,
        className,
        ...props
    }: React.HTMLAttributes<HTMLDivElement>) => {
        return (
            <div className={clsx('pl-8 pt-8 max-w-xl', className)} {...props}>
                {children}
            </div>
        );
    },
};

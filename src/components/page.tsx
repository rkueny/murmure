import clsx from 'clsx';
import React from 'react';

export const Page = {
    Header: ({
        children,
        className,
        ...props
    }: React.HTMLAttributes<HTMLDivElement>) => {
        return (
            <div className={clsx(className)} {...props}>
                {children}
            </div>
        );
    },
};

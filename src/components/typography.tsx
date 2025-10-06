import clsx from 'clsx';

export const Typography = {
    Title: ({
        children,
        className,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement>) => {
        return (
            <h2 className={clsx('font-medium', className)} {...props}>
                {children}
            </h2>
        );
    },

    Paragraph: ({
        children,
        className,
        ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => {
        return (
            <p className={clsx('text-sm text-zinc-400', className)} {...props}>
                {children}
            </p>
        );
    },
};

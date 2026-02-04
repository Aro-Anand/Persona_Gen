import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', asChild = false, ...props }, ref) => {
    const variants = {
        primary: "bg-primary text-white hover:bg-indigo-700 shadow-md hover:shadow-lg",
        outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
        secondary: "bg-white text-slate-900 border border-slate-200 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 shadow-sm",
    };

    const sizes = {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-3",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
    };

    const Component = motion.button;

    return (
        <Component
            ref={ref}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});
Button.displayName = "Button";

export { Button };

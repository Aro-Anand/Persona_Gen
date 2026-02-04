import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const OptionCard = ({ selected, onClick, title, description, className }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "cursor-pointer rounded-xl border-2 p-4 transition-all relative overflow-hidden",
                selected
                    ? "border-primary bg-indigo-50/50 ring-1 ring-primary"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h4 className={cn("font-medium text-lg", selected ? "text-primary" : "text-slate-900")}>
                        {title}
                    </h4>
                    {description && (
                        <p className="text-sm text-slate-500 mt-1">{description}</p>
                    )}
                </div>
                {selected && (
                    <div className="bg-primary text-white p-1 rounded-full shadow-md animate-in fade-in zoom-in duration-200">
                        <Check size={16} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export { OptionCard };

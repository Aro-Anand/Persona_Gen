import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const OptionCard = ({ selected, onClick, title, description, className }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className={cn(
                "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 relative",
                selected
                    ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                    : "border-slate-600/50 bg-slate-800/30 hover:border-indigo-400/60 hover:bg-slate-700/40",
                className
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h4 className={cn(
                        "font-medium text-sm leading-relaxed",
                        selected ? "text-white" : "text-slate-200"
                    )}>
                        {title}
                    </h4>
                    {description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
                    )}
                </div>
                {selected && (
                    <div className="bg-indigo-500 text-white p-1 rounded-full shadow-md flex-shrink-0 mt-0.5">
                        <Check size={14} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export { OptionCard };

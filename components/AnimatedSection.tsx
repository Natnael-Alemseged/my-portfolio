"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay }}
            className={clsx(className)}
        >
            {children}
        </motion.section>
    );
}

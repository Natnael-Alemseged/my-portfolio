// lib/console-cleaner.ts
import { useEffect } from 'react';

export const useConsoleCleaner = (enabled: boolean = false, intervalMs: number = 10000) => {
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            intervalId = setInterval(() => {
                console.clear();
            }, intervalMs);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [enabled, intervalMs]);
};
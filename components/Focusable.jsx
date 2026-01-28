"use client";

import React, { useRef, useEffect } from 'react';
import { useFocus } from '@/context/FocusContext';
import { cn } from '@/lib/utils';

export default function Focusable({ children, id, className }) {
    const { registerSection, unregisterSection, focusedSectionId } = useFocus();
    const ref = useRef(null);

    const isFocused = focusedSectionId === id.toLowerCase();

    useEffect(() => {
        if (ref.current) {
            registerSection(id, ref.current);
        }

        return () => {
            unregisterSection(id);
        };
    }, [registerSection, unregisterSection, id]);

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-400",
                isFocused && "relative z-[9999] scale-[1.02] shadow-[0_0_30px_rgba(100,255,218,0.6),0_0_60px_rgba(100,255,218,0.3)] border-2 border-[rgba(100,255,218,0.8)] rounded-lg",
                className
            )}
        >
            {children}
        </div>
    );
}

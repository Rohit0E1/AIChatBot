"use client";

import React, { useRef, useEffect } from 'react';
import { useClick } from '@/context/ClickContext';
import { cn } from '@/lib/utils';

export default function Clickable({ children, id, label, onClick, className, as: Component = 'button', ...props }) {
    const { registerClickable, unregisterClickable, triggeredId } = useClick();
    const ref = useRef(null);

    const isTriggered = triggeredId === id.toLowerCase();

    useEffect(() => {
        if (ref.current) {
            registerClickable(id, label || id, onClick, ref.current);
        }

        return () => {
            unregisterClickable(id);
        };
    }, [registerClickable, unregisterClickable, id, label, onClick]);

    return (
        <Component
            ref={ref}
            onClick={onClick}
            className={cn(
                "transition-all duration-200",
                isTriggered && "ring-2 ring-accent ring-offset-2 scale-95",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

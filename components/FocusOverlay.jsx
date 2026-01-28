"use client";

import React from 'react';
import { useFocus } from '@/context/FocusContext';

export default function FocusOverlay() {
    const { isOverlayVisible, clearFocus } = useFocus();

    if (!isOverlayVisible) return null;

    return (
        <div
            className="fixed inset-0 bg-black/75 z-[9998] animate-fade-in cursor-pointer"
            onClick={clearFocus}
            aria-hidden="true"
        />
    );
}

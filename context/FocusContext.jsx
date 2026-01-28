"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const FocusContext = createContext();

export const useFocus = () => {
    const context = useContext(FocusContext);
    if (!context) {
        throw new Error('useFocus must be used within a FocusProvider');
    }
    return context;
};

export const FocusProvider = ({ children }) => {
    const [sectionRegistry, setSectionRegistry] = useState({});

    const [focusedSectionId, setFocusedSectionId] = useState(null);

    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    const registerSection = useCallback((id, ref) => {
        setSectionRegistry(prev => ({
            ...prev,
            [id.toLowerCase()]: { ref }
        }));
    }, []);

    const unregisterSection = useCallback((id) => {
        setSectionRegistry(prev => {
            const newRegistry = { ...prev };
            delete newRegistry[id.toLowerCase()];
            return newRegistry;
        });
    }, []);

    const focusOnSection = useCallback((sectionName) => {
        console.log(`[FocusContext] focusOnSection called with: ${sectionName}`);
        if (!sectionName) return false;

        const lowerName = sectionName.toLowerCase();

        let matchedId = null;
        if (sectionRegistry[lowerName]) {
            matchedId = lowerName;
        } else {
            matchedId = Object.keys(sectionRegistry).find(id =>
                id.includes(lowerName) || lowerName.includes(id)
            );
        }

        if (matchedId && sectionRegistry[matchedId]) {
            const section = sectionRegistry[matchedId];
            console.log(`[FocusContext] Found section: ${matchedId}`);

            setFocusedSectionId(matchedId);
            setIsOverlayVisible(true);

            if (section.ref) {
                section.ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            setTimeout(() => {
                clearFocus();
            }, 5000);

            return true;
        }

        console.warn(`[FocusContext] Section not found: ${sectionName}`);
        return false;
    }, [sectionRegistry]);

    const clearFocus = useCallback(() => {
        setFocusedSectionId(null);
        setIsOverlayVisible(false);
    }, []);

    return (
        <FocusContext.Provider value={{
            registerSection,
            unregisterSection,
            focusOnSection,
            clearFocus,
            focusedSectionId,
            isOverlayVisible
        }}>
            {children}
        </FocusContext.Provider>
    );
};

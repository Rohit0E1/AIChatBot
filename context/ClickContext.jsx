"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

const ClickContext = createContext();

export const useClick = () => {
    const context = useContext(ClickContext);
    if (!context) {
        throw new Error('useClick must be used within a ClickProvider');
    }
    return context;
};

export const ClickProvider = ({ children }) => {
    const [clickRegistry, setClickRegistry] = useState({});

    const [triggeredId, setTriggeredId] = useState(null);

    const registerClickable = useCallback((id, label, onClick, ref) => {
        setClickRegistry(prev => ({
            ...prev,
            [id.toLowerCase()]: { label, onClick, ref }
        }));
    }, []);

    const unregisterClickable = useCallback((id) => {
        setClickRegistry(prev => {
            const newRegistry = { ...prev };
            delete newRegistry[id.toLowerCase()];
            return newRegistry;
        });
    }, []);

    const triggerClick = useCallback((query) => {
        console.log(`[ClickContext] triggerClick called with: ${query}`);
        if (!query) return false;

        const lowerQuery = query.toLowerCase();

        let matchedId = null;
        if (clickRegistry[lowerQuery]) {
            matchedId = lowerQuery;
        } else {
            matchedId = Object.keys(clickRegistry).find(id => {
                const item = clickRegistry[id];
                return id.includes(lowerQuery) ||
                    lowerQuery.includes(id) ||
                    item.label?.toLowerCase().includes(lowerQuery) ||
                    lowerQuery.includes(item.label?.toLowerCase());
            });
        }

        if (matchedId && clickRegistry[matchedId]) {
            const clickable = clickRegistry[matchedId];
            console.log(`[ClickContext] Found clickable: ${matchedId}, label: ${clickable.label}`);

            setTriggeredId(matchedId);
            setTimeout(() => setTriggeredId(null), 500);

            if (clickable.ref) {
                clickable.ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            setTimeout(() => {
                if (clickable.onClick) {
                    clickable.onClick();
                }
            }, 300);

            return true;
        }

        console.warn(`[ClickContext] Clickable not found: ${query}`);
        return false;
    }, [clickRegistry]);

    return (
        <ClickContext.Provider value={{
            registerClickable,
            unregisterClickable,
            triggerClick,
            triggeredId
        }}>
            {children}
        </ClickContext.Provider>
    );
};

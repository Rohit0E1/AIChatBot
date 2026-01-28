"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

const AIFormContext = createContext();

export const useAIForm = () => {
    const context = useContext(AIFormContext);
    if (!context) {
        throw new Error('useAIForm must be used within an AIFormProvider');
    }
    return context;
};

export const AIFormProvider = ({ children }) => {
    const [fieldRegistry, setFieldRegistry] = useState({});

    const registerField = useCallback((name, setter, ref = null) => {
        setFieldRegistry(prev => ({
            ...prev,
            [name.toLowerCase()]: { setter, ref }
        }));
    }, []);

    const unregisterField = useCallback((name) => {
        setFieldRegistry(prev => {
            const newRegistry = { ...prev };
            delete newRegistry[name.toLowerCase()];
            return newRegistry;
        });
    }, []);

    const fillField = useCallback((name, value) => {
        const key = name.toLowerCase();
        const field = fieldRegistry[key];

        if (field && field.setter) {
            console.log(`[AIFormContext] Filling field "${name}" with "${value}"`);
            field.setter(value);

            if (field.ref) {
                const originalBorder = field.ref.style.border;
                field.ref.style.transition = 'all 0.5s ease';
                field.ref.style.border = '2px solid #64ffda';
                setTimeout(() => {
                    field.ref.style.border = originalBorder;
                }, 2000);

                field.ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return true;
        }

        console.warn(`[AIFormContext] Field "${name}" not found in registry`);
        return false;
    }, [fieldRegistry]);

    return (
        <AIFormContext.Provider value={{ registerField, unregisterField, fillField }}>
            {children}
        </AIFormContext.Provider>
    );
};

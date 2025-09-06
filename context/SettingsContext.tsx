import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Currency } from '../types';

interface SettingsContextType {
    defaultCurrency: Currency;
    setDefaultCurrency: (currency: Currency) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [defaultCurrency, setDefaultCurrencyState] = useState<Currency>(() => {
        return localStorage.getItem('defaultCurrency') || 'USD';
    });

    useEffect(() => {
        localStorage.setItem('defaultCurrency', defaultCurrency);
    }, [defaultCurrency]);

    const setDefaultCurrency = (currency: Currency) => {
        setDefaultCurrencyState(currency);
    };

    return (
        <SettingsContext.Provider value={{ defaultCurrency, setDefaultCurrency }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

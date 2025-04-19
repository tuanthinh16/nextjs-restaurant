'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import i18n from '@/i18n'; // Import the i18n instance

type LanguageContextType = {
    locale: string;
    setLocale: (locale: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState('en'); // Default language is English

    const changeLanguage = (newLocale: string) => {
        setLocale(newLocale);
        i18n.changeLanguage(newLocale); // Update the language in i18next
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale: changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/app/languageContex';

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const languages = [
        { code: 'vi', flag: '🇻🇳', label: 'Vietnamese' },
        { code: 'en', flag: '🇺🇸', label: 'English' },
        { code: 'ko', flag: '🇰🇷', label: 'Korean' },
    ];

    const handleChange = (code: string) => {
        setLocale(code);
        setOpen(false);
    };
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <div ref={dropdownRef}>
            {/* Mobile: hiện 3 lá cờ */}
            <div className="flex gap-2 md:hidden">
                {languages.map(({ code, flag }) => (
                    <button
                        key={code}
                        onClick={() => handleChange(code)}
                        className={`w-8 h-8 rounded-full text-lg flex items-center justify-center
                            ${locale === code ? 'bg-red-600 text-white ring-2 ring-red-300' : 'bg-red-400 text-white hover:bg-red-600'}
                        `}
                        aria-label={`Switch to ${code}`}
                    >
                        {flag}
                    </button>
                ))}
            </div>

            {/* Desktop: hiện dropdown */}
            <div className="relative inline-block text-left md:block">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-8 h-8  text-white rounded-full  items-center justify-center cursor-pointer hidden md:flex"
                    title="Select language"
                >
                    🌐
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-36 bg-brown-500 border rounded shadow-lg z-50 bg-gray-500">
                        {languages.map(({ code, flag, label }) => (
                            <button
                                key={code}
                                onClick={() => handleChange(code)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left cursor-pointer
                                    ${locale === code ? 'bg-brown-100 font-bold text-yellow-200' : 'hover:bg-brown-800'}
                                `}
                            >
                                <span>{flag}</span>
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

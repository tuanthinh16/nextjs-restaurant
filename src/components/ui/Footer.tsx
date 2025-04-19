'use client';

import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export const Footer = () => {
    const { t } = useTranslation('common'); // Load translations from common.json

    const navItems = t('navItems', { returnObjects: true }) as { href: string; label: string }[];

    return (
        <footer className="bg-gray-800 text-white">
            <div className="border-t border-gray-800 py-6">
                <div className="container mx-auto px-4">
                    <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4">
                        {navItems?.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="text-white hover:text-gray-50 hover:font-bold transition-colors duration-200 text-sm"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="text-center text-sm text-gray-400">
                        {t('footer.copyright')}
                    </div>
                </div>
            </div>
        </footer>
    );
}
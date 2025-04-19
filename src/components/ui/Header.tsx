'use client'

import { MenuItems } from '@/data/menu'
import { Ga_Maamli, Mogra, Pacifico, Poppins } from 'next/font/google'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from 'next-i18next';
import { X } from 'lucide-react'
import { business_name } from '@/config/config'

const ga_Maamli = Ga_Maamli({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-ga-maamli',
})

const moga = Mogra({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-mogra',
})

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400'],
    variable: '--poppins',
})

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSticky, setIsSticky] = useState(false)
    const { t } = useTranslation('common');
    const navItems = t('navItems', { returnObjects: true }) as { href: string; label: string }[];
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`w-full fixed top-0 z-1 transition-all duration-300 ${isOpen ?? 'bg-gray-200'} ${isSticky && !isOpen ? 'bg-gray-200/80 backdrop-blur shadow-md py-2' : 'bg-transparent py-4'
                } text-white`}
        >
            <div className="container relative mx-auto px-4 flex items-center justify-between transition-all duration-300">
                <h1
                    className={`text-3xl font-bold text-center items-center transition-all duration-300 ${isSticky ? 'text-2xl' : 'text-3xl'
                        } ${ga_Maamli.className}`}
                >
                    {business_name}
                </h1>

                {/* Desktop menu */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-white hover:text-primary transition-colors duration-200 font-medium"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="flex gap-4">
                        <LanguageSwitcher />
                    </div>
                    <button
                        aria-label="Search"
                        className="text-white cursor-pointer hover:text-primary transition-colors duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </button>
                </nav>

                {/* Mobile button */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                            />
                        </svg>
                    )}
                </button>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center transition-all duration-300 z-50">
                        <button
                            className="absolute top-4 right-4 text-white p-2"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                        <nav className="flex flex-col items-center space-y-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-white hover:text-primary text-xl font-medium transition-colors duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="absolute bottom-8 flex gap-4">
                            <LanguageSwitcher />
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header

'use client'

import { Mogra } from 'next/font/google'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from 'next-i18next'
import { X, Utensils, Search, Phone, Home, Users, BookOpen, Salad, Trash2, ShoppingBag, MapPin } from 'lucide-react'
import { business_name, ratioUSDperVND, ratioWperVND } from '@/config/config'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image'
import { removeFromCart } from '@/redux/cartSlice'
import { useLanguage } from '@/app/languageContex'
import { showToast } from './Toast'



const mogra = Mogra({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-mogra',
})

interface HeaderProps {
    classNameHeader?: string;
}

const Header: React.FC<HeaderProps> = ({ classNameHeader }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [isSticky, setIsSticky] = useState(false)
    const { t } = useTranslation('common')
    const navItems = t('navItems', { returnObjects: true }) as { href: string; label: string }[]
    const { locale } = useLanguage();
    const dispatch = useDispatch();
    // Icons for each nav item
    const navIcons = {
        home: <Home size={18} className="mr-2" />,
        about: <Users size={18} className="mr-2" />,
        menu: <Utensils size={18} className="mr-2" />,
        cart: <ShoppingBag size={18} className="mr-2" />,
        news: <Salad size={18} className="mr-2" />,
        careers: <Users size={18} className="mr-2" />,
        branches: <MapPin size={18} className="mr-2" />,
        gallery: <BookOpen size={18} className="mr-2" />,
        contact: <Phone size={18} className="mr-2" />
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const totalItems = useSelector((state: RootState) =>
        state.cart.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
    );
    const cart = useSelector((state: RootState) => state.cart);
    const [showCart, setShowCart] = useState(false);

    const toggleCart = () => {
        setShowCart(prev => !prev);
    };
    const onDeleteItem = (id: number) => {
        showToast(`🛒${t('cart.removeSuccess')} `, 'info');
        dispatch(removeFromCart(id));
    }
    return (
        <header
            className={`w-full fixed top-0 z-1 transition-all duration-300 ${isOpen ?? 'bg-gray-200'} ${isSticky && !isOpen ? 'bg-gray-200/80 backdrop-blur shadow-md py-2' : 'bg-transparent py-4'
                } text-white ${classNameHeader}`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo/Brand */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center"
                >
                    <Link href="/" className="flex items-center">
                        <Salad size={32} className="text-amber-600 mr-2" />
                        <h1 className={`text-2xl md:text-3xl font-bold ${mogra.className} bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent`}>
                            {business_name}
                        </h1>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={item.href}
                                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${isSticky ? 'text-gray-800 hover:bg-amber-50' : 'text-white hover:bg-white/10'}`}
                            >
                                {navIcons[item.href.replace('/', '') as keyof typeof navIcons] || navIcons.home}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </motion.div>
                    ))}

                    <div className="flex items-center ml-4 space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Search"
                            className={`p-2 rounded-full ${isSticky ? 'text-gray-800 hover:bg-amber-50' : 'text-white hover:bg-white/10'}`}
                        >
                            <Search size={20} />
                        </motion.button>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                        >
                            <LanguageSwitcher />
                        </motion.div>

                        {/* <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`ml-2 px-4 py-2 rounded-lg font-medium ${isSticky ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-white text-amber-600 hover:bg-white/90'}`}
                        >
                            {t('reservation')}
                        </motion.button> */}
                        <div className="relative text-gray-800 dark:text-white cursor-pointer " onClick={toggleCart} title='Cart'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>

                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        {showCart && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-12 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
                            >
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('cart.title')}</h3>
                                        <span className="text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-2 py-1 rounded-full">
                                            {cart.length} {t('cart.items')}
                                        </span>
                                    </div>
                                </div>

                                {cart.length === 0 ? (
                                    <div className="p-6 text-center">
                                        <ShoppingBag size={40} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">{t('cart.empty')}</p>
                                        <p className="text-sm text-gray-400 mt-1">{t('cart.hint')}</p>
                                        <button
                                            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                                            onClick={() => setShowCart(false)}
                                        >
                                            {t('cart.continueShopping')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                                        <ul className="py-2">

                                            {cart.map((item, index) => (
                                                <li key={index} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                                                {item.image_url && (
                                                                    <Image
                                                                        src={item.image_url}
                                                                        alt={item.image_url}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="48px"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {item.quantity} ×
                                                                    {locale === 'vi' || locale === 'en' ? (
                                                                        <>≈ ${(item.price / ratioUSDperVND).toFixed(2)} $</>
                                                                    ) : locale === 'ko' ? (
                                                                        <>≈ ₩{Math.round(item.price / ratioWperVND)}</>
                                                                    ) : null}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-amber-600 dark:text-amber-400">
                                                                {(() => {
                                                                    const total = (item.price * (item.quantity ?? 0));
                                                                    if (locale === 'ko') {
                                                                        // Giả sử tỉ giá 1₫ = 0.05₩ (ví dụ)
                                                                        const won = total / ratioWperVND;
                                                                        return won.toLocaleString('ko-KR') + '₩';
                                                                    } else {
                                                                        // Mặc định là vnđ hoặc en dùng đô la Mỹ
                                                                        if (locale === 'en') {
                                                                            // Chuyển vnđ sang USD giả định 1 USD = 24000 VND
                                                                            const usd = total / ratioUSDperVND;
                                                                            return usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                                                                        }
                                                                        return total.toLocaleString('vi-VN') + '₫';
                                                                    }
                                                                })()}
                                                            </span>
                                                            <button
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                onClick={() => onDeleteItem(item.id)}
                                                                aria-label="Xóa món"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-gray-600 dark:text-gray-300">{t('cart.tempPrice')}</span>
                                                <span className="font-semibold text-gray-800 dark:text-white">
                                                    {(() => {
                                                        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity ?? 0)), 0);
                                                        if (locale === 'ko') {
                                                            // Giả sử tỉ giá 1₫ = 0.05₩ (ví dụ)
                                                            const won = total / ratioWperVND;
                                                            return won.toLocaleString('ko-KR') + '₩';
                                                        } else {
                                                            // Mặc định là vnđ hoặc en dùng đô la Mỹ
                                                            if (locale === 'en') {
                                                                // Chuyển vnđ sang USD giả định 1 USD = 24000 VND
                                                                const usd = total / ratioUSDperVND;
                                                                return usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                                                            }
                                                            return total.toLocaleString('vi-VN') + '₫';
                                                        }
                                                    })()}
                                                    <p className='font-normal text-green-600'>{'≈' + cart.reduce((sum, item) => sum + (item.price * (item.quantity ?? 0)), 0).toLocaleString('vi-VN') + '₫'}</p>
                                                </span>

                                            </div>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href="/cart"
                                                    className="flex-1 px-4 py-2 text-center border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                    onClick={() => setShowCart(false)}
                                                >
                                                    {t('cart.viewCart')}
                                                </Link>
                                                {/* <Link
                                                    href="/checkout"
                                                    className="flex-1 px-4 py-2 text-center bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                                                    onClick={() => setShowCart(false)}
                                                >
                                                    {t('cart.checkout')}
                                                </Link> */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    {isOpen ? (
                        <X size={24} className={isSticky ? 'text-gray-800' : 'text-white'} />
                    ) : (

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className={`w-6 h-6 ${isSticky ? 'text-gray-800' : 'text-white'}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </motion.button>

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

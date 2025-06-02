'use client'
import { get } from '@/utils/api';
import React, { useEffect, useState } from 'react'
import CardLoading from '../ui/CardLoading';
import { useLanguage } from '@/app/languageContex';
import { useTranslation } from 'react-i18next';
import { Dish } from '@/types';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { ratioUSDperVND, ratioWperVND } from '@/config/config';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { defaultDataMenu } from '@/data/defaultData';
import { showToast } from '../ui/Toast';
import Image from 'next/image';

const MenuSection = () => {
    const [data, setData] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | unknown>(null);
    const { locale } = useLanguage();
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    console.log('curent API server:', process.env.NEXT_PUBLIC_API_URL);
    useEffect(() => {
        setLoading(true);
        if (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL === '') {
            setData(defaultDataMenu as Dish[]);
            setLoading(false)
        }
        else {
            get('/api/menu?target_lang=' + locale)
                .then(res => setData(res.data as Dish[]))
                .catch(err => {
                    console.error(err);
                    // Dữ liệu giả định khi lỗi

                    setError(err);
                })
                .finally(() => setLoading(false));
        }

    }, [locale]);



    console.log('Menu data:', data);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <CardLoading key={i} />
                    ))}
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="text-center py-12 text-red-500">
                    Error : {error instanceof Error ? error.message : String(error)}
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {

        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
                    <p>{t('noMenuFound')}</p>
                </div>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };
    const onAddCart = (dish: Dish) => {
        dispatch(addToCart({ dish, quantity: 1 }));
        // console.log('Added to cart:', dish);
        showToast(`🛒${t('cart.addsuccess')} `, 'success');
    }
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Wavy divider */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="wavy-divider -mt-16 mb-16"
            ></motion.div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-between mb-8 relative text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {t('menuTitle')}
                    </h1>

                    <Link
                        href="/menu"
                        className="group flex items-center space-x-1 text-amber-600 hover:text-amber-700 transition-colors"
                    >
                        <span className="font-medium">{t('buttonSeeMore')}</span>
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>
                <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {data.slice(0, 5).map((dish) => (
                    <motion.div
                        key={dish.id}
                        variants={item}
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                        {dish.image_url && (
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={dish.image_url}
                                    alt={dish.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h2 className="text-xl font-bold text-white">{dish.name}</h2>
                                </div>
                            </div>
                        )}
                        <div className="p-6">
                            <p className="text-gray-600 mb-2">{dish.description}</p>
                            <p className="text-sm text-green-600 mb-4">
                                {locale === 'vi' || locale === 'en' ? (
                                    <>≈ ${(dish.price / ratioUSDperVND).toFixed(2)} $</>
                                ) : locale === 'ko' ? (
                                    <>≈ ₩{Math.round(dish.price / ratioWperVND)}</>
                                ) : null}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-amber-600 font-bold text-xl">{dish.price.toLocaleString()}₫</span>
                                <motion.button
                                    onClick={() => {
                                        onAddCart(dish);
                                        // Optional: Add a small animation feedback
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-amber-600 hover:text-amber-700 rounded-full transition-colors group cursor-pointer"
                                    aria-label={t('addToCart')}
                                    title={t('addToCart')}
                                >
                                    <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                                    <span className="sr-only">{t('addToCart')}</span>
                                </motion.button>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default MenuSection;
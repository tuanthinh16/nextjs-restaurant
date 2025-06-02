'use client'
import { get } from '@/utils/api'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/app/languageContex'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { Dish, MenuItemPDF } from '@/types'
import Header from '@/components/ui/Header'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/redux/cartSlice'
import { showToast } from '@/components/ui/Toast'
import { defaultDataMenu } from '@/data/defaultData'
import Image from 'next/image'

const page = () => {
    return (
        <div>

            <MenuPage />
            <MenuPageDetail />
        </div>
    )
}

export default page


const MenuPage = () => {
    const [menuItems, setMenuItems] = useState<MenuItemPDF[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<MenuItemPDF | null>(null)
    const { t } = useTranslation('common')

    // Mock data fallback
    const mockMenuItems: MenuItemPDF[] = Array(5).fill(0).map((_, i) => ({
        id: `mock-${i}`,
        image_url: 'https://i.pinimg.com/736x/da/aa/7b/daaa7bbe564f83cb48578ded546e8d0f.jpg',
        title: t(`menu.defaultTitle${i + 1}`),
        description: t(`menu.defaultDescription${i + 1}`)
    }))

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true)
            try {
                if (!process.env.NEXT_PUBLIC_API_URL) {
                    setMenuItems(mockMenuItems)
                    return
                }

                const response = await get<MenuItemPDF[]>('/api/menu/get-menu')
                setMenuItems(response.data && response.data.length > 0 ? response.data : mockMenuItems)
            } catch (err) {
                console.error('Failed to fetch menu:', err)
                setError(t('menu.fetchError'))
                setMenuItems(mockMenuItems)
            } finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, [])

    const handleDownloadPDF = () => {
        const pdfUrl = process.env.NEXT_PUBLIC_MENU_PDF_URL || '/menu.pdf'
        window.open(pdfUrl, '_blank')
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Header />
            <div className='w-full h-16 bg-gradient-to-r from-amber-200 to-slate-500 flex items-center justify-center'></div>
            <div className="container mx-auto px-4 py-12">
                {/* Header section */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                    >
                        {t('menu.title')}
                    </motion.h1>
                    <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownloadPDF}
                        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg mx-auto transition-colors"
                    >
                        <Download size={18} />
                        <span>{t('menu.downloadPDF')}</span>
                    </motion.button>
                </div>

                {/* Menu gallery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {menuItems.slice(0, 5).map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={item.image_url}
                                    content='lazy'
                                    fill
                                    alt={item.title || t('menu.menuItem')}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            {(item.title || item.description) && (
                                <div className="p-4">
                                    {item.title && <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>}
                                    {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Image dialog - Custom implementation */}
                <AnimatePresence>
                    {selectedImage && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                                onClick={() => setSelectedImage(null)}
                            />

                            {/* Dialog content */}
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: 'spring', damping: 25 }}
                                    className="relative transform overflow-hidden rounded-xl bg-white shadow-xl transition-all max-w-4xl w-full"
                                >
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                                        aria-label={t('menu.close')}
                                    >
                                        <X size={24} />
                                    </button>

                                    <div className="max-h-[80vh] overflow-auto">
                                        <Image
                                            src={selectedImage.image_url}
                                            alt={selectedImage.title || t('menu.menuItem')}
                                            width={350}
                                            height={500}

                                            className="w-full h-auto object-contain"
                                        />
                                    </div>

                                    {(selectedImage.title || selectedImage.description) && (
                                        <div className="p-6 bg-white">
                                            {selectedImage.title && (
                                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                                    {selectedImage.title}
                                                </h2>
                                            )}
                                            {selectedImage.description && (
                                                <p className="text-gray-600">
                                                    {selectedImage.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}


const MenuPageDetail = () => {
    const [menuItems, setMenuItems] = useState<Dish[]>([])
    const [filteredItems, setFilteredItems] = useState<Dish[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<Dish | null>(null)
    const [activeCategory, setActiveCategory] = useState<number>(0)
    const [quantity, setQuantity] = useState(1)
    const { locale } = useLanguage()
    const { t } = useTranslation('common')
    const dispatch = useDispatch()

    // Mock data fallback with Korean restaurant items


    // Categories for filtering
    const categories: { id: number; name: string }[] = [
        { id: 0, name: t('menu.all') },
        { id: 1, name: t('menu.food') },
        { id: 2, name: t('menu.drink') },
        { id: 3, name: t('menu.combo') },
        { id: 4, name: t('menu.special') }
    ]

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true)
            try {
                if (!process.env.NEXT_PUBLIC_API_URL) {
                    setMenuItems(defaultDataMenu)
                    setFilteredItems(defaultDataMenu)
                    return
                }

                const response = await get<Dish[]>('/api/menu/get-menu')
                const items = (response.data ?? []).length > 0 ? response.data ?? [] : defaultDataMenu
                setMenuItems(items)
                setFilteredItems(items)
            } catch (err) {
                console.error('Failed to fetch menu:', err)
                setError(t('menu.fetchError'))
                setMenuItems(defaultDataMenu)
                setFilteredItems(defaultDataMenu)
            } finally {
                setLoading(false)
            }
        }

        fetchMenu();
    }, [locale, t])

    // Filter items by category
    useEffect(() => {
        if (activeCategory === 0) {
            setFilteredItems(menuItems)
        } else {
            setFilteredItems(menuItems.filter(item => item.menu_type_id === activeCategory))
        }
    }, [activeCategory, menuItems])

    // const handleDownloadPDF = () => {
    //     const pdfUrl = process.env.NEXT_PUBLIC_MENU_PDF_URL || '/menu.pdf'
    //     window.open(pdfUrl, '_blank')
    // }

    const addToCartHandler = (item: Dish) => {
        dispatch(addToCart({ dish: item, quantity }))
        showToast(`${t('cart.addsuccess')} ${quantity} ${item.name}`, 'success')
        setQuantity(1)
    }


    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div className="mb-8">

            </motion.div>
            {/* SEO-friendly header */}
            <header className="text-center mb-12">
                {/* <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                >
                    {t('menu.title')}
                </motion.h1> */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-600 max-w-2xl mx-auto mb-6"
                >
                    {t('menu.subtitle')}
                </motion.p>
                <div className="w-24 h-1 bg-rose-500 mx-auto mb-8"></div>
            </header>

            {/* Category filters */}
            <motion.div
                className="flex flex-wrap justify-center gap-2 mb-12 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors ${activeCategory === category.id
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </motion.div>

            {/* Menu grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">
                {filteredItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {/* Item image */}
                        <div
                            className="relative h-48 overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <Image
                                src={item.image_url ?? ''}
                                alt={item.name}
                                width={350}
                                height={500}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                loading="lazy"
                            />
                            {/* Badges */}
                            {/* <div className="absolute top-2 left-2 flex gap-2">
                                {item.is_best_seller && (
                                    <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                                        {t('menu.bestSeller')}
                                    </span>
                                )}
                                {item.is_vegetarian && (
                                    <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                                        {t('menu.vegetarian')}
                                    </span>
                                )}
                                {item.spicy_level && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {t('menu.spicy')} {item.spicy_level}/5
                                    </span>
                                )}
                            </div> */}
                        </div>

                        {/* Item details */}
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h2>
                            <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                            <div className="flex justify-between items-center">
                                <span className="text-rose-600 font-bold text-lg">
                                    {item.price.toLocaleString()}₫
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-1 text-gray-500 hover:text-rose-600 rounded-full"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-1 text-gray-500 hover:text-rose-600 rounded-full"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => addToCartHandler(item)}
                                    className="p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
                                    aria-label={t('addToCart')}
                                >
                                    <ShoppingCart size={18} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Image modal */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => setSelectedImage(null)}
                        />

                        {/* Dialog content */}
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="relative transform overflow-hidden rounded-xl bg-white shadow-xl transition-all max-w-4xl w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                                    aria-label={t('menu.close')}
                                >
                                    <X size={24} />
                                </button>

                                <div className="max-h-[80vh] overflow-auto">
                                    <Image
                                        src={selectedImage.image_url ?? ''}
                                        alt={selectedImage.name}
                                        width={350}
                                        height={500}
                                        className="w-full h-auto object-contain"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="p-6 bg-white">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {selectedImage.name}
                                    </h2>
                                    <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-rose-600 font-bold text-xl">
                                            {selectedImage.price.toLocaleString()}₫
                                        </span>
                                        <button
                                            onClick={() => {
                                                addToCartHandler(selectedImage)
                                                setSelectedImage(null)
                                            }}
                                            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                        >
                                            <ShoppingCart size={18} />
                                            {/* {t('addToCart')} */}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
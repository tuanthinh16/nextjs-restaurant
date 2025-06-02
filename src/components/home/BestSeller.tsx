'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel'
import { useEffect, useState } from 'react'
import { get } from '@/utils/api'
import CardLoading from '../ui/CardLoading'
import { font_title } from '@/config/font'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/app/languageContex'
import { business_logo } from '@/config/config'
import { Dish } from '@/types'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { addToCart } from '@/redux/cartSlice'
import { useDispatch } from 'react-redux'
import { showToast } from '../ui/Toast'

export function BestSeller() {
    const { t } = useTranslation('common');
    const [data, setData] = useState<Dish[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)
    const { locale } = useLanguage();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL === '') {
            setData([
                { id: 1, name: 'Phở Bò', price: 45000, description: 'Phở bò truyền thống Hà Nội', image_url: 'https://images.pexels.com/photos/6646024/pexels-photo-6646024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', menu_type_id: 1 },
                { id: 2, name: 'Bún Chả', price: 40000, description: 'Bún chả Hà Nội', image_url: 'https://khaihoanphuquoc.com.vn/wp-content/uploads/2023/08/cach-lam-nuoc-mam-bun-cha-02.jpg', menu_type_id: 1 },
                { id: 3, name: 'Cà Phê Sữa Đá', price: 25000, description: 'Cà phê sữa đá truyền thống', image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1000', menu_type_id: 2 },
                { id: 4, name: 'Bánh Mì', price: 20000, description: 'Bánh mì thịt đặc biệt', image_url: 'https://images.pexels.com/photos/14226649/pexels-photo-14226649.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', menu_type_id: 1 },
                { id: 5, name: 'Trà Đá', price: 5000, description: 'Trà đá mát lạnh', image_url: 'https://images.pexels.com/photos/24304858/pexels-photo-24304858/free-photo-of-l-nh-u-ng-n-c-da-bang.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', menu_type_id: 2 }
            ] as Dish[]);
            setLoading(false)
        }
        else {
            get<Dish[]>('/api/menu/best-seller?target_lang=' + locale)
                .then(res => setData(res.data as Dish[]))
                .catch(err => setError(err))
                .finally(() => setLoading(false))
        }
    }, [locale])

    if (loading) return <CardLoading />
    if (error)
        return (
            <div className="text-center py-12 text-red-500">
                Error loading best sellers: {error instanceof Error ? error.message : String(error)}
            </div>
        );
    if (!data || data.length === 0) return <div className="text-center py-12 text-gray-500">No best sellers found</div>

    const onSelect = (id: number) => {
        const selectedItem = data.find(item => item.id === id)
        //console.log("Selected item: ", selectedItem)
        if (selectedItem) {
            // Dispatch action to add item to cart
            dispatch(addToCart({ dish: selectedItem, quantity: 1 }));
            showToast(`🛒${t('cart.addsuccess')} `, 'success');
        }
    }

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }


    return (
        <section className="relative py-20 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-amber-200 mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-red-200 mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Wavy divider */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="wavy-divider -mt-16 mb-16"
                ></motion.div>

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-16"
                >
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mb-6"
                    >
                        <Image
                            src={business_logo}
                            alt="Logo"
                            fill
                            className="rounded-lg shadow-md"
                        />
                    </motion.div>

                    <div className="flex items-center mb-4">
                        <Star className="text-amber-500 fill-amber-500 mr-2" size={24} />
                        <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 ${font_title.className}`}>
                            <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                                {t('bestSellerTitle')}
                            </span>
                        </h2>
                        <Star className="text-amber-500 fill-amber-500 ml-2" size={24} />
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl text-center">
                        {t('bestSellerSubtitle')}
                    </p>
                </motion.div>

                {/* Desktop carousel */}
                <div className="hidden md:block">
                    <Carousel opts={{
                        loop: true,
                        align: "center",
                        dragFree: true
                    }} className="w-full max-w-7xl mx-auto pb-6">
                        <CarouselContent>
                            {data?.slice(0, 5).map(item => (
                                <CarouselItem key={item.id} className="md:basis-1/3 lg:basis-1/4">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="block w-full h-full transition-transform duration-300"
                                    >
                                        <div
                                            className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer h-full "
                                            onClick={() => onSelect(item.id)}
                                        >
                                            <div className="relative h-60 w-full mb-4 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.image_url || ''}
                                                    alt={item.name}
                                                    fill
                                                    objectFit='cover'
                                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                                                    <span className="text-white font-semibold">
                                                        {item.price.toLocaleString()}₫
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-center flex-1 flex flex-col">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 flex-1">
                                                    {item.description}
                                                </p>
                                                {/* <button className="mt-auto cursor-pointer px-3 py-2  text-amber-700 rounded-lg  transition-colors text-sm font-medium text-center items-center flex gap-2 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                                                    <ShoppingCart size={16} />
                                                </button> */}
                                            </div>
                                        </div>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 border-none bg-white shadow-lg hover:bg-amber-50 text-amber-600 hover:text-amber-700" />
                        <CarouselNext className="right-4 border-none bg-white shadow-lg hover:bg-amber-50 text-amber-600 hover:text-amber-700" />
                    </Carousel>
                </div>

                {/* Mobile grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="md:hidden grid grid-cols-2 gap-6"
                >
                    {data.slice(0, 4).map(item => (
                        <motion.div
                            key={item.id}
                            variants={container}
                            className="block w-full"
                        >
                            <div
                                className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => onSelect(item.id)}
                            >
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src={item.image_url || ''}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 100vw"
                                    />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 text-center mb-1">
                                    {item.name}
                                </h3>
                                <span className="text-amber-600 text-sm font-medium">
                                    {item.price.toLocaleString()}₫
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mt-16"
                >
                    <Link href="/menu">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            {t('buttonSeeMore')}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
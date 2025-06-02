'use client'

import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/app/languageContex'
import { get } from '@/utils/api'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Clock, Star, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CardLoading from '../ui/CardLoading'

interface Promotion {
    id: string
    title: string
    description: string
    discount: string
    image_url: string
    end_date: string
    is_featured?: boolean
}

export function PromotionSection() {
    const { t } = useTranslation('common')
    const { locale } = useLanguage()
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL === '') {
            // Mock data when no API available
            setPromotions([
                {
                    id: '1',
                    title: 'Ưu đãi đặc biệt mùa hè',
                    description: 'Giảm giá 20% cho tất cả các món từ 2-5PM hàng ngày',
                    discount: '20% OFF',
                    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
                    end_date: '2025-12-31',
                    is_featured: true
                },
                {
                    id: '2',
                    title: 'Combo gia đình',
                    description: 'Mua 3 tặng 1 cho các combo từ 4 người trở lên',
                    discount: 'BUY 3 GET 1',
                    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
                    end_date: '2025-11-30'
                },
                {
                    id: '3',
                    title: 'Ưu đãi sinh nhật',
                    description: 'Giảm 30% cho khách hàng trong tháng sinh nhật',
                    discount: '30% OFF',
                    image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
                    end_date: '2025-12-31'
                }
            ])
            setLoading(false)
        } else {
            get<Promotion[]>('/api/promotions?target_lang=' + locale)
                .then(res => setPromotions(res.data as Promotion[]))
                .catch(err => setError(err))
                .finally(() => setLoading(false))
        }
    }, [locale])

    if (loading) return <CardLoading />
    if (error) return <div className="text-center py-12 text-red-500">{t('errorLoadingPromotions')}</div>
    if (!promotions || promotions.length === 0) return <div className="text-center py-12 text-gray-500">{t('noPromotions')}</div>

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    }

    return (
        <section className="relative py-20 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-60 h-60 rounded-full bg-amber-100/50 mix-blend-multiply filter blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-red-100/50 mix-blend-multiply filter blur-3xl animate-float-delay"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <Sparkles className="text-amber-500 mr-2" size={24} />
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                            <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                                {t('promotionTitle')}
                            </span>
                        </h2>
                        <Sparkles className="text-amber-500 ml-2" size={24} />
                    </div>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        {t('promotionSubtitle')}
                    </p>
                </motion.div>

                {/* Promotions grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {promotions.map((promo) => (
                        <motion.div
                            key={promo.id}
                            variants={item}
                            whileHover={{ y: -8, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                            className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${promo.is_featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
                        >
                            {/* Discount badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-red-500 text-white px-4 py-1 rounded-full font-bold z-10 shadow-lg flex items-center">
                                <Star className="mr-1" size={16} fill="white" />
                                {promo.discount}
                            </div>

                            {/* Featured ribbon */}
                            {promo.is_featured && (
                                <div className="absolute top-0 left-0 bg-gradient-to-r from-red-600 to-amber-600 text-white px-6 py-2 font-bold z-10 clip-path-ribbon shadow-md">
                                    {t('featured')}
                                </div>
                            )}

                            {/* Image */}
                            <div className="relative h-64 w-full">
                                <Image
                                    src={promo.image_url}
                                    alt={promo.title}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={promo.is_featured}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="bg-white p-6">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{promo.title}</h3>
                                <p className="text-gray-600 mb-5">{promo.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock size={16} className="mr-2" />
                                        {t('validUntil')} {new Date(promo.end_date).toLocaleDateString(locale)}
                                    </div>

                                    <Link
                                        href={`/promotions/${promo.id}`}
                                        className="group flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
                                    >
                                        {t('learnMore')}
                                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-16"
                >
                    <Link href="/promotions">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(239, 68, 68, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center mx-auto"
                        >
                            {t('viewAllPromotions')}
                            <ArrowRight size={18} className="ml-2" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Custom CSS */}
            <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out infinite 2s;
        }
        .clip-path-ribbon {
          clip-path: polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%);
        }
      `}</style>
        </section>
    )
}
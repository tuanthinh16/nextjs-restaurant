'use client'
import { images } from '@/data/imageCarouse'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const HeroSection = () => {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
    const { t } = useTranslation('common')
    const router = useRouter()

    // Auto-rotation with smooth direction handling
    useEffect(() => {
        const interval = setInterval(() => {
            setDirection(1)
            setCurrent((prev) => (prev + 1) % images.length)
        }, 7000) // Increased duration for better viewing
        return () => clearInterval(interval)
    }, [])

    // Manual navigation with direction control
    const goToSlide = useCallback((index: number) => {
        setDirection(index > current ? 1 : -1)
        setCurrent(index)
    }, [current])

    // SEO-friendly image alt texts
    const altTexts = [
        t('heroItems.image1Alt'),
        t('heroItems.image2Alt'),
        t('heroItems.image3Alt')
    ]

    // Animation variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 }
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0,
            transition: {
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
            }
        })
    }

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    }

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(239, 68, 68, 0.4)"
        },
        tap: {
            scale: 0.98
        }
    }

    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* Image slider with smooth transitions */}
            <AnimatePresence custom={direction} initial={false}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                >
                    <Image
                        src={images[current]}
                        alt={altTexts[current] || `Restaurant image ${current + 1}`}
                        fill
                        priority={current === 0}
                        className="object-cover"
                        quality={100}
                        sizes="100vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70"></div>
                </motion.div>
            </AnimatePresence>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    className="max-w-4xl mx-auto"
                >
                    <motion.h1
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
                            {t('heroItems.title')}
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl mb-4 text-gray-100 font-light"
                        variants={textVariants}
                    >
                        {t('heroItems.subtitle')}
                    </motion.p>

                    <motion.p
                        className="text-lg md:text-xl mb-10 text-gray-200"
                        variants={textVariants}
                    >
                        {t('heroItems.subtitle2')}
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4"
                        variants={textVariants}
                    >
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg text-white font-semibold text-lg shadow-lg"
                            onClick={() => router.push('/about-us')}
                        >
                            {t('buttonSeeMore')}
                        </motion.button>
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="px-8 py-3 bg-transparent border-2 border-white rounded-lg text-white font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors"
                            onClick={() => router.push('/table')}
                        >
                            {t('buttonCallNow')}
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Slide indicators */}
                <motion.div
                    className="absolute bottom-8 left-0 right-0 flex justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection
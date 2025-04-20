'use client'
import { images } from '@/data/imageCarouse'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const HeroSection = () => {
    const [current, setCurrent] = useState(0)
    const { t } = useTranslation('common');
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])
    const router = useRouter();
    return (
        <section className="relative w-full h-screen overflow-hidden">
            {images.map((img, index) => (
                <Image
                    src={img}
                    alt={`Image ${index + 1}`}
                    key={index}
                    fill
                    priority={index === 0}
                    className={` relative object-cover transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
            ))}

            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">{t('heroItems.title')}</h2>
                <p className="text-lg md:text-xl mb-4">{t('heroItems.subtitle')}</p>
                <p className="text-lg md:text-xl mb-8">{t('heroItems.subtitle2')}</p>
                <div className="space-x-4">
                    <button className="px-4 py-2 bg-red-700 rounded-lg border border-red-400 hover:border-red-800 hover:bg-red-500 hover:font-bold cursor-pointer" onClick={() => router.push('/about-us')}>{t('buttonSeeMore')}</button>
                    <button className="px-4 py-2 bg-red-700 rounded-lg border border-red-400 hover:border-red-800 hover:bg-red-500 hover:font-bold cursor-pointer" onClick={() => router.push('/table')}>{t('buttonCallNow')}</button>
                </div>
            </div>
        </section>
    )
}

export default HeroSection

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

export function BestSeller() {
    const { t } = useTranslation('common');
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)
    const { locale } = useLanguage();
    useEffect(() => {
        get('/api/menu/best-seller?target_lang=' + locale)
            .then(res => setData(res.data))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [locale])
    if (loading) return <CardLoading />
    if (error) return <div>Error: {error.message}</div>
    if (!data || data.length === 0) return <div>No Found</div>

    const onSelect = (id: string) => {
        const selectedItem = data.find(item => item.id === id)
        console.log("click ID: ", selectedItem)
    }

    return (
        <>
            <section className="bg-dark-texture py-16" >
                <div className="container mx-auto px-4" >
                    <div className="wavy-divider -mt-16 mb-10"></div>
                    {/* Section header */}
                    <div className="flex justify-center mb-8">
                        <Image
                            src={business_logo}
                            alt="Logo"
                            width={70}
                            height={70}
                        />
                    </div>
                    <h2 className={`text-center text-3xl md:text-4xl font-bold text-white mb-12 ${font_title.className}`}>
                        {t('bestSellerTitle')}
                    </h2>

                    {/* Desktop carousel */}
                    <div className="hidden md:block">
                        <Carousel opts={{ loop: true }} className="w-full max-w-5xl mx-auto">
                            <CarouselContent>
                                {data.map(item => (
                                    <CarouselItem key={item.id} className="md:basis-1/3">
                                        <div className="block w-full">
                                            <div className="flex flex-col items-center p-2 transition-transform hover:-translate-y-1 hover:bg-muted cursor-pointer hover:shadow-lg" onClick={() => onSelect(item.id)}>
                                                <div className="h-48 w-48 relative mb-4  ">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <h3 className="text-white text-center text-sm font-semibold h-12">
                                                    {item.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className=" text-white border-none hover:bg-red-500 -left-15 bg-red-300 cursor-pointer" />
                            <CarouselNext className="text-white border-none hover:bg-red-500 -right-15 bg-red-300 cursor-pointer" />
                        </Carousel>
                    </div>

                    {/* Mobile grid */}
                    <div className="md:hidden grid grid-cols-2 gap-4">
                        {data.slice(0, 4).map(item => (
                            <div key={item.id} className="block w-full">
                                <div className="flex flex-col items-center p-2" onClick={() => onSelect(item.id)} >
                                    <div className="h-32 w-32 relative mb-2">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3 className="text-white text-center text-xs font-medium h-10">
                                        {item.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center mt-12">
                        <Link href="/menu">
                            <button className="bg-primary hover:bg-primary-dark text-white px-8 rounded-full cursor-pointer py-2 font-semibold transition duration-300 hover:text-red-300 ease-in-out flex items-center gap-2">
                                See More
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

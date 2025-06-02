'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/ui/Header'
import Image from 'next/image'
const page = () => {
    return (
        <>

            <AboutSection />
        </>
    )
}

export default page



const AboutSection = () => {
    const { t } = useTranslation('common')

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    const features = [
        {
            title: t('about.qualityTitle'),
            description: t('about.qualityDesc'),
            icon: '✨'
        },
        {
            title: t('about.craftsmanshipTitle'),
            description: t('about.craftsmanshipDesc'),
            icon: '👕'
        },
        {
            title: t('about.sustainabilityTitle'),
            description: t('about.sustainabilityDesc'),
            icon: '🌱'
        }
    ]

    return (
        <>
            <Header />
            <div className='w-full h-16 bg-gradient-to-r from-amber-200 to-slate-500 flex items-center justify-center'>

            </div>
            <div className="m-auto px-10 py-12 bg-gradient-to-br from-gray-400 via-neutral-200 to-amber-50 w-full">
                {/* Wavy divider - consistent with MenuSection */}
                {/* <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="wavy-divider -mt-16 mb-16"
                ></motion.div> */}

                {/* Section header - consistent styling */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        {t('about.title')}
                    </h1>
                    <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {t('about.subtitle')}
                    </p>
                </motion.div>

                {/* Story section */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-16"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <motion.div
                            variants={item}
                            className="md:w-1/2"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {t('about.ourStory')}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {t('about.storyPart1')}
                            </p>
                            <p className="text-gray-600 mb-4">
                                {t('about.storyPart2')}
                            </p>
                            <Link
                                href="/story"
                                className="group inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors"
                            >
                                <span className="font-medium">{t('buttonSeeMore')}</span>
                                <ArrowRight
                                    size={18}
                                    className="ml-1 group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                        </motion.div>
                        <motion.div
                            variants={container}
                            className="md:w-1/2 rounded-xl overflow-hidden"
                        >
                            <div className="relative h-80 w-full">
                                <iframe width="350" height="315" src="https://www.youtube.com/embed/w0ItI8M6HFI?si=vc9IpM72tj7sXApU" title="YouTube video player"
                                    frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Features section */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        {t('about.whyChooseUs')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={item}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                className="bg-gray-100 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Team section */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        {t('about.ourTeam')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <motion.div
                                key={item}
                                variants={container}
                                className="bg-gray-200 rounded-xl overflow-hidden shadow-lg"
                            >
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={`https://images.pexels.com/photos/32325857/pexels-photo-32325857/free-photo-of-chan-dung-den-tr-ng-c-a-m-t-ng-i-dan-ong-ph-n-chi-u-trong-b-vest.jpeg?auto=compress&cs=tinysrgb&w=600`}
                                        alt={t('about.teamMemberAlt', { number: item })}
                                        fill
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-bold text-lg text-gray-800">
                                        {t(`about.teamMember${item}Name`)}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {t(`about.teamMember${item}Role`)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-amber-50 rounded-xl p-8 text-center"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {t('about.readyToExperience')}
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        {t('about.ctaDescription')}
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        {t('buttonCallNow')}
                    </Link>
                </motion.div>
            </div>
        </>
    )
}

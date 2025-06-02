'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { font_title } from '@/config/font';
import { business_logo } from '@/config/config';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function AboutSection() {
    const { t } = useTranslation('common');

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemLeft = {
        hidden: { opacity: 0, x: -50 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    const itemRight = {
        hidden: { opacity: 0, x: 50 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-amber-400 mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-red-400 mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Wavy divider */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="wavy-divider -mt-16 mb-16"
                ></motion.div>

                {/* Two-column layout */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-col lg:flex-row items-center gap-12"
                >
                    {/* Left column: Content */}
                    <motion.div
                        variants={itemLeft}
                        className="w-full lg:w-1/2 text-left"
                    >
                        {/* Header (Logo + Title) */}
                        <div className="flex items-center mb-10 gap-6">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Image
                                    src={business_logo}
                                    alt="Logo"
                                    fill
                                    className="rounded-lg shadow-md"
                                />
                            </motion.div>
                            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 ${font_title.className}`}>
                                <span className="bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
                                    {t('aboutUs')}
                                </span>
                            </h2>
                        </div>

                        <motion.p
                            whileHover={{ x: 5 }}
                            className="text-xl mb-8 leading-relaxed text-gray-700 font-medium"
                        >
                            <strong className="text-2xl bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                                Ăn với Quán Nhỏ, bạn sẽ được trải nghiệm một Hồng Kông thu nhỏ ngay giữa lòng Hà Nội.
                            </strong>
                        </motion.p>

                        <motion.p
                            className="mb-10 leading-relaxed text-gray-600 text-lg"
                            whileHover={{ x: 5 }}
                        >
                            Với không gian đẳng cấp, đồ ăn ngon mang đậm hương vị riêng biệt, nhân viên chu đáo, nhiệt tình, mỗi cuộc vui của bạn sẽ trở nên thăng hoa. Không bao giờ chán, từ đêm đến sáng!
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href="/about">
                                <Button className="relative overflow-hidden group">
                                    <span className="relative z-10 flex items-center">
                                        {/* Optional icon */}
                                        {/* <Image
                                            src="https://ext.same-assets.com/2455550972/2363731609.png"
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="mr-2"
                                        /> */}
                                        Xem thêm
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right column: Image */}
                    <motion.div
                        variants={itemRight}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                            <div className="w-full h-[500px] rounded-2xl overflow-hidden relative">
                                <Image
                                    src="https://ext.same-assets.com/2455550972/2363731609.png"
                                    alt="Quán Nhỏ Restaurant"
                                    fill
                                    className="object-cover object-center transition-transform duration-700 hover:scale-110"
                                    loading='lazy'
                                    quality={90}
                                />
                            </div>
                            {/* Decorative border */}
                            <div className="absolute inset-0 border-4 border-transparent hover:border-amber-400/30 transition-all duration-500 pointer-events-none rounded-2xl"></div>
                        </div>

                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute -bottom-6 -right-6 bg-white px-6 py-3 rounded-full shadow-lg flex items-center"
                        >
                            <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                            <span className="font-medium text-gray-800">Since 2010</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
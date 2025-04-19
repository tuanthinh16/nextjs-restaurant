'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { font_title } from '@/config/font';
import { business_logo } from '@/config/config';
import { useTranslation } from 'react-i18next';
export function AboutSection() {
    const { t } = useTranslation('common');
    return (
        <section className="bg-texture py-16" style={{
            // backgroundImage: "url(/about-us.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.9,
        }}>
            <div className="container mx-auto px-4">
                <div className="wavy-divider -mt-16 mb-10"></div>

                {/* Layout 2 phần */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Bên phải: Nội dung */}
                    <div className="w-full md:w-1/2 text-left">
                        {/* Header (Logo + Tiêu đề) */}
                        <div className="items-center mb-8 gap-4 flex">
                            <Image
                                src={business_logo}
                                alt="Logo"
                                width={70}
                                height={70}
                                className="mr-4"
                            />
                            <h2 className={`text-3xl md:text-4xl font-bold text-primary-dark ${font_title.className}`}>
                                {t('aboutUs')}
                            </h2>
                        </div>

                        <p className="text-lg mb-6 leading-relaxed">
                            <strong>
                                Ăn với Quán Nhỏ, bạn sẽ được trải nghiệm một Hồng Kông thu nhỏ ngay giữa lòng Hà Nội.
                            </strong>
                        </p>

                        <p className="mb-8 leading-relaxed">
                            Với không gian đẳng cấp, đồ ăn ngon mang đậm hương vị riêng biệt, nhân viên chu đáo, nhiệt tình, mỗi cuộc vui của bạn sẽ trở nên thăng hoa. Không bao giờ chán, từ đêm đến sáng!
                        </p>

                        {/* CTA Button */}
                        <Link href="/about">
                            <Button className="bg-red-500 hover:bg-red-800 text-white flex items-center rounded-lg cursor-pointer">
                                {/* <Image
                                    src="https://ext.same-assets.com/2455550972/2363731609.png"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="mr-2"
                                /> */}
                                Xem thêm
                            </Button>
                        </Link>
                    </div>

                    {/* Bên trái: Ảnh */}
                    <div className="w-full md:w-1/2">
                        <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-[450px] rounded-lg overflow-hidden relative">
                                <Image
                                    src="https://ext.same-assets.com/2455550972/2363731609.png"
                                    alt="Quán Nhỏ Restaurant"
                                    fill
                                    className="object-cover object-center"
                                    loading='lazy'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

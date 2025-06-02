'use client'
import { useEffect, useRef, useState } from "react";
import { AboutSection } from "@/components/home/AboutSection";
import { BestSeller } from "@/components/home/BestSeller";
import HeroSection from "@/components/home/HeroSection";
import MenuSection from "@/components/home/MenuSection";
import Header from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { PromotionSection } from "@/components/home/PromotionSection";
import MapEmbed from "@/components/ui/MapComponent";

export default function Home() {
    const [inView, setInView] = useState({
        about: false,
        bestSeller: false,
        menu: false,
        promotion: false,
        mapembed: false,
    });

    const aboutRef = useRef(null);
    const bestSellerRef = useRef(null);
    const menuRef = useRef(null);
    const proRef = useRef(null);
    const mapRef = useRef(null);
    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load lại
    }, []); // Chỉ gọi 1 lần khi component được mount

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry], observer) => {
                if (entry.isIntersecting) {
                    setInView((prev) => ({
                        ...prev,
                        [entry.target.id]: true,
                    }));
                    observer.unobserve(entry.target); // Để không gọi lại lần nữa
                }
            },
            { threshold: 0.3 } // Phần tử cần xuất hiện ít nhất 30% trong viewport
        );

        if (aboutRef.current) observer.observe(aboutRef.current);
        if (bestSellerRef.current) observer.observe(bestSellerRef.current);
        if (menuRef.current) observer.observe(menuRef.current);
        if (proRef.current) observer.observe(proRef.current);
        if (mapRef.current) observer.observe(mapRef.current);
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <Header />
            <HeroSection />
            <div
                id="about"
                ref={aboutRef}
                className={`${inView.about ? "animate-fadeInUp" : "opacity-0"
                    } transition-all duration-1000`}
            >
                <AboutSection />
            </div>
            <div
                id="bestSeller"
                ref={bestSellerRef}
                className={`${inView.bestSeller ? "animate-slideInFromLeft" : "opacity-0"
                    } transition-all duration-1000`}
            >
                <BestSeller />
            </div>
            <div
                id="menu"
                ref={menuRef}
                className={`${inView.menu ? "animate-zoomIn" : "opacity-0"
                    } transition-all duration-1000`}
            >
                <MenuSection />
            </div>
            <div id="promotion"
                ref={proRef}
                className={`${inView.promotion ? "animate-fadeInUp" : "opacity-0"
                    } transition-all duration-1000`}
            >
                <PromotionSection />
            </div>
            <div id="mapembed"
                ref={mapRef}
                className={`${inView.mapembed ? "animate-fadeInDown" : "opacity-0"
                    } transition-all duration-1000`}
            >
                <MapEmbed />
            </div>
            <Footer />
        </>
    );
}

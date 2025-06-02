// components/MapEmbed.tsx
import { motion } from "framer-motion";

export default function MapEmbed() {
    return (
        <motion.div
            className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Wavy divider */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="wavy-divider -mt-16 mb-16"
            ></motion.div>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7774217507636!2d106.69249337570308!3d10.751630059649282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f0c0956de3f%3A0x54c4c8f517f1ad4b!2zOTIxIMSQLiBUcuG6p24gWHXDom4gU2_huqFuLCBUw6JuIEjGsG5nLCBRdeG6rW4gNywgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1748868546715!5m2!1svi!2s"
                width="100%"
                height="450"
                className="w-full h-[450px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </motion.div>
    );
}

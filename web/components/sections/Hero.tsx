'use client'

import { motion as m, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

    return (
        <section
            ref={ref}
            className="relative h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Image with Parallax */}
            <m.div
                style={{ scale }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://rynvillage.co.za/wp-content/uploads/2025/04/1-1.jpg')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
            </m.div>

            {/* Content */}
            <m.div
                style={{ opacity, y }}
                className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
            >
                <m.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                >
                    Welcome to your
                    <br />
                    <span className="text-primary">dream retirement</span>
                </m.h1>

                <m.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto"
                >
                    Experience retirement in luxury
                    <br />
                    without the luxury of high costs.
                </m.p>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <a
                        href="#units"
                        className="px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        View Units
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all"
                    >
                        Book a Viewing
                    </a>
                </m.div>
            </m.div>

            {/* Scroll Indicator */}
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            >
                <m.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-white/70"
                >
                    <ChevronDown size={32} />
                </m.div>
            </m.div>
        </section>
    )
}

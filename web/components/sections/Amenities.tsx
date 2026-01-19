'use client'

import { motion as m } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Dumbbell, Lock, Heart, Briefcase, Home, Cross, Users, Stethoscope } from 'lucide-react'

const amenities = [
    {
        icon: Dumbbell,
        title: 'Leisure Amenities',
        description: 'Clubhouse with restaurant, library, heated indoor pool, gym, and business centre.',
        color: 'from-emerald-500 to-teal-600',
    },
    {
        icon: Lock,
        title: 'Security Measures',
        description: 'Specialist security system with professional team operating 24/7.',
        color: 'from-indigo-500 to-purple-600',
    },
    {
        icon: Cross,
        title: 'Frail Care',
        description: 'State-of-the-art onsite frail care centre with 24/7 emergency response.',
        color: 'from-rose-500 to-pink-600',
    },
    {
        icon: Briefcase,
        title: 'Estate Management',
        description: 'Experienced in-house team handling all maintenance at no extra cost.',
        color: 'from-amber-500 to-orange-600',
    },
    {
        icon: Home,
        title: 'Life Rights',
        description: 'Live in your home for life with 30-50% savings on upfront costs.',
        color: 'from-cyan-500 to-blue-600',
    },
    {
        icon: Stethoscope,
        title: 'Health Services',
        description: 'Onsite nurse with regular checkups, blood pressure monitoring, and wound care.',
        color: 'from-green-500 to-emerald-600',
    },
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
}

export default function Amenities() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section id="amenities" className="py-24 bg-background-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary">
                        The Ryn Village Advantage
                    </h2>
                    <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
                        With life rights at Ryn Village, you enjoy all the benefits of ownership without the associated costs.
                    </p>
                </m.div>

                {/* Amenity Grid */}
                <m.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {amenities.map((amenity) => (
                        <m.div
                            key={amenity.title}
                            variants={cardVariants}
                            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${amenity.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${amenity.color} flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors`}>
                                    <amenity.icon className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="font-semibold text-xl text-text group-hover:text-white transition-colors">
                                    {amenity.title}
                                </h3>

                                <p className="mt-3 text-text-muted group-hover:text-white/90 transition-colors">
                                    {amenity.description}
                                </p>
                            </div>
                        </m.div>
                    ))}
                </m.div>
            </div>
        </section>
    )
}

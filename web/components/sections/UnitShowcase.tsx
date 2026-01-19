'use client'

import { motion as m } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Bed, Bath, Maximize, ChevronLeft, ChevronRight } from 'lucide-react'

const units = [
    {
        id: '1A',
        name: '1 Bedroom Apartment',
        bedrooms: 1,
        bathrooms: 1,
        size: '55m²',
        description: 'Perfect for singles or couples seeking a cozy retirement home with lift access.',
        image: 'https://rynvillage.co.za/wp-content/uploads/2022/04/RENDERS_RYNPARK-2B_01_Photo-10.jpg',
        features: ['Lift Access', 'Open Plan Living', 'Modern Kitchen', 'Secure Entry'],
    },
    {
        id: '2A',
        name: '2 Bedroom Apartment',
        bedrooms: 2,
        bathrooms: 2,
        size: '85m²',
        description: 'Spacious apartment with guest room and lift access for comfortable living.',
        image: 'https://rynvillage.co.za/wp-content/uploads/2025/04/2-1.jpg',
        features: ['Lift Access', 'Guest Bedroom', 'Balcony', 'Storage Room'],
    },
    {
        id: '2B',
        name: '2 Bedroom Home',
        bedrooms: 2,
        bathrooms: 2,
        size: '95m²',
        description: 'Stand-alone home with private garden and single garage.',
        image: 'https://rynvillage.co.za/wp-content/uploads/2025/04/3.jpg',
        features: ['Private Garden', 'Single Garage', 'Covered Patio', 'Garden Shed'],
    },
    {
        id: '3A',
        name: '3 Bedroom Home',
        bedrooms: 3,
        bathrooms: 2,
        size: '120m²',
        description: 'Premium home with spacious rooms, double garage, and entertainment area.',
        image: 'https://rynvillage.co.za/wp-content/uploads/2025/04/4.jpg',
        features: ['Double Garage', 'Study Nook', 'Large Garden', 'Entertainment Area'],
    },
]

export default function UnitShowcase() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [activeIndex, setActiveIndex] = useState(0)

    const nextUnit = () => {
        setActiveIndex((prev) => (prev + 1) % units.length)
    }

    const prevUnit = () => {
        setActiveIndex((prev) => (prev - 1 + units.length) % units.length)
    }

    const activeUnit = units[activeIndex]

    return (
        <section id="units" className="py-24 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
                        Available Units
                    </h2>
                    <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
                        Premium-quality homes and apartments meeting exceptionally high standards.
                    </p>
                </m.div>

                {/* Unit Showcase */}
                <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image Side */}
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                    >
                        <m.img
                            key={activeUnit.id}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            src={activeUnit.image}
                            alt={activeUnit.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Navigation Arrows */}
                        <div className="absolute inset-0 flex items-center justify-between p-4">
                            <button
                                onClick={prevUnit}
                                className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextUnit}
                                className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Unit Badge */}
                        <div className="absolute top-4 left-4 px-4 py-2 bg-primary rounded-full text-white font-semibold">
                            Unit {activeUnit.id}
                        </div>
                    </m.div>

                    {/* Info Side */}
                    <m.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white"
                    >
                        <m.h3
                            key={activeUnit.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-serif text-3xl md:text-4xl font-bold"
                        >
                            {activeUnit.name}
                        </m.h3>

                        {/* Stats */}
                        <div className="flex gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <Bed className="w-5 h-5 text-primary" />
                                <span>{activeUnit.bedrooms} Bed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Bath className="w-5 h-5 text-primary" />
                                <span>{activeUnit.bathrooms} Bath</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Maximize className="w-5 h-5 text-primary" />
                                <span>{activeUnit.size}</span>
                            </div>
                        </div>

                        <p className="mt-6 text-lg text-white/80 leading-relaxed">
                            {activeUnit.description}
                        </p>

                        {/* Features */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {activeUnit.features.map((feature) => (
                                <span
                                    key={feature}
                                    className="px-4 py-2 bg-white/10 rounded-full text-sm"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="#contact"
                                className="px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all"
                            >
                                Enquire About This Unit
                            </a>
                            <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all">
                                View Floor Plan
                            </button>
                        </div>

                        {/* Pagination Dots */}
                        <div className="mt-8 flex gap-2">
                            {units.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === activeIndex
                                            ? 'bg-primary w-8'
                                            : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </m.div>
                </div>
            </div>
        </section>
    )
}

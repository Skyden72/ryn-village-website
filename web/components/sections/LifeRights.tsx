'use client'

import { motion as m, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, TrendingUp, Shield, Home } from 'lucide-react'

const benefits = [
    {
        icon: TrendingUp,
        title: '30-50% Savings',
        description: 'Save significantly on upfront costs compared to full ownership.',
    },
    {
        icon: Shield,
        title: 'No Transfer Fees',
        description: 'No transfer duties, fees, or VAT - more savings for you.',
    },
    {
        icon: Home,
        title: 'Maintenance Included',
        description: 'All maintenance covered - plumbing, repairs, and more at no extra cost.',
    },
]

const features = [
    'Live in your home for life',
    'No special levies ever',
    'Predictable budget with 2-year levy estimates',
    'Solar power - no outages',
    'Developer maintains the property',
    'Protected from unforeseen expenses',
]

export default function LifeRights() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section id="life-rights" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content Side */}
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary font-semibold uppercase tracking-wide">
                            Financial Security
                        </span>
                        <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-secondary">
                            Life Rights at Ryn Village
                        </h2>
                        <p className="mt-6 text-lg text-text-muted leading-relaxed">
                            Purchasing a life right grants you the legal right to live in your home for life,
                            along with your partner if applicable. It's much cheaper than buying - usually
                            between 30% and 50% less expensive.
                        </p>

                        {/* Feature List */}
                        <ul className="mt-8 space-y-4">
                            {features.map((feature, index) => (
                                <m.li
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-text">{feature}</span>
                                </m.li>
                            ))}
                        </ul>

                        <m.a
                            href="#contact"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="inline-block mt-10 px-8 py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary-dark transition-all shadow-lg hover:shadow-xl"
                        >
                            Learn More About Life Rights
                        </m.a>
                    </m.div>

                    {/* Benefits Cards */}
                    <m.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {benefits.map((benefit, index) => (
                            <m.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                                className="p-6 bg-background-cream rounded-2xl border border-primary/10 hover:border-primary/30 transition-colors"
                            >
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <benefit.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-secondary">
                                            {benefit.title}
                                        </h3>
                                        <p className="mt-2 text-text-muted">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </m.div>
                </div>
            </div>
        </section>
    )
}

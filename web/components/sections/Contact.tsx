'use client'

import { motion as m, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react'

const units = [
    { value: '', label: 'Select Unit of Interest' },
    { value: '1A', label: 'Unit 1A - 1 Bedroom Apartment' },
    { value: '2A', label: 'Unit 2A - 2 Bedroom Apartment' },
    { value: '2B', label: 'Unit 2B - 2 Bedroom Home' },
    { value: '2C', label: 'Unit 2C - 2 Bedroom Home' },
    { value: '2D', label: 'Unit 2D - 2 Bedroom Home' },
    { value: '3A', label: 'Unit 3A - 3 Bedroom Home' },
    { value: '3B', label: 'Unit 3B - 3 Bedroom Home' },
]

export default function Contact() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [formState, setFormState] = useState({
        firstName: '',
        surname: '',
        email: '',
        phone: '',
        unit: '',
        message: '',
        marketing: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Form submission logic here
        console.log('Form submitted:', formState)
    }

    return (
        <section id="contact" className="py-24 bg-background-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary">
                        Schedule A Private Showing
                    </h2>
                    <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
                        Take the first step towards your dream retirement. Contact us today.
                    </p>
                </m.div>

                <div ref={ref} className="grid lg:grid-cols-5 gap-12">
                    {/* Contact Info */}
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-secondary">Visit Us</h3>
                                    <p className="mt-1 text-text-muted">
                                        Ryn Village Estate<br />
                                        South Africa
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-secondary">Call Us</h3>
                                    <a href="tel:+27000000000" className="mt-1 text-text-muted hover:text-primary transition-colors">
                                        +27 (0) 00 000 0000
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-secondary">Email Us</h3>
                                    <a href="mailto:info@rynvillage.co.za" className="mt-1 text-text-muted hover:text-primary transition-colors">
                                        info@rynvillage.co.za
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-2xl shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-secondary">Opening Hours</h3>
                                    <p className="mt-1 text-text-muted">
                                        Mon - Fri: 8:00 AM - 5:00 PM<br />
                                        Sat: 9:00 AM - 1:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </m.div>

                    {/* Contact Form */}
                    <m.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-xl"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-text mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    required
                                    value={formState.firstName}
                                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="surname" className="block text-sm font-medium text-text mb-2">
                                    Surname *
                                </label>
                                <input
                                    type="text"
                                    id="surname"
                                    required
                                    value={formState.surname}
                                    onChange={(e) => setFormState({ ...formState, surname: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-text mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    value={formState.phone}
                                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="unit" className="block text-sm font-medium text-text mb-2">
                                Unit of Interest
                            </label>
                            <select
                                id="unit"
                                value={formState.unit}
                                onChange={(e) => setFormState({ ...formState, unit: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                {units.map((unit) => (
                                    <option key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="marketing"
                                checked={formState.marketing}
                                onChange={(e) => setFormState({ ...formState, marketing: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="marketing" className="text-sm text-text-muted">
                                I want to receive marketing updates
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="mt-8 w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
                        >
                            <Send className="w-5 h-5" />
                            Submit Enquiry
                        </button>
                    </m.form>
                </div>
            </div>
        </section>
    )
}

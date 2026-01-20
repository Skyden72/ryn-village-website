'use client'

import { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navItems = [
    { label: 'Amenities', href: '#amenities' },
    { label: 'Unit Plans', href: '#units' },
    { label: 'Life Rights', href: '#life-rights' },
    { label: 'Contact Us', href: '#contact' },
]

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <m.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/90 backdrop-blur-lg shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="Ryn Village"
                            className={`h-28 w-auto transition-all ${isScrolled ? '' : 'brightness-0 invert'}`}
                        />
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`text-lg font-medium transition-colors hover:text-primary ${isScrolled ? 'text-text' : 'text-white'
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
                        >
                            Book A Viewing
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? (
                            <X className={isScrolled ? 'text-text' : 'text-white'} size={24} />
                        ) : (
                            <Menu className={isScrolled ? 'text-text' : 'text-white'} size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white shadow-xl"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className="block text-text font-medium py-2 hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setIsMobileOpen(false)}
                                className="block w-full text-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors"
                            >
                                Book A Viewing
                            </a>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </m.nav>
    )
}

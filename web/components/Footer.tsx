'use client'

import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = [
    { label: 'Amenities', href: '#amenities' },
    { label: 'Unit Plans', href: '#units' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Life Rights', href: '#life-rights' },
    { label: 'Contact Us', href: '#contact' },
]

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-secondary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand Column */}
                    <div>
                        <h3 className="font-serif text-2xl font-bold mb-4">Ryn Village</h3>
                        <p className="text-white/70 leading-relaxed">
                            Experience retirement in luxury without the luxury of high costs.
                            Life rights offer affordable entry and low levies.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-white/70 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-white/70">
                                    Ryn Village Estate, South Africa
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="tel:+27000000000" className="text-white/70 hover:text-primary transition-colors">
                                    +27 (0) 00 000 0000
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="mailto:info@rynvillage.co.za" className="text-white/70 hover:text-primary transition-colors">
                                    info@rynvillage.co.za
                                </a>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-6">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/50 text-sm">
                        © {currentYear} Ryn Village Retirement Estate. All Rights Reserved.
                    </p>
                    <a
                        href="/privacy-policy"
                        className="text-white/50 text-sm hover:text-primary transition-colors"
                    >
                        Privacy Policy
                    </a>
                </div>
            </div>
        </footer>
    )
}

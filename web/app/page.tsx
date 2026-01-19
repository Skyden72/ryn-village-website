'use client'

import { motion as m } from 'framer-motion'
import Hero from '@/components/sections/Hero'
import Amenities from '@/components/sections/Amenities'
import UnitShowcase from '@/components/sections/UnitShowcase'
import LifeRights from '@/components/sections/LifeRights'
import Contact from '@/components/sections/Contact'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function Home() {
    return (
        <main className="relative">
            <Navigation />

            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <Hero />
                <Amenities />
                <UnitShowcase />
                <LifeRights />
                <Contact />
            </m.div>

            <Footer />
        </main>
    )
}

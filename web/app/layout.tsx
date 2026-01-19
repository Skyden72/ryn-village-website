import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
})

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Ryn Village | Retirement Estate | Welcome To Your Dream Retirement',
    description: 'Enjoy a worry-free retirement lifestyle at Ryn Village. Life rights offer affordable entry and low levies for premium retirement living.',
    keywords: ['retirement estate', 'life rights', 'retirement village', 'South Africa', 'frail care'],
    openGraph: {
        title: 'Ryn Village | Retirement Estate',
        description: 'Experience retirement in luxury without the luxury of high costs.',
        images: ['/images/og-image.jpg'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}

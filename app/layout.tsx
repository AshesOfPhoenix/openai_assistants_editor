import AssistantsProvider from '@/app/AssistantsContext'
import Footer from '@/components/Footer'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './styles/globals.css'

export const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
})

export const metadata: Metadata = {
    title: 'GptnomicsGPT',
    description: 'GPTs Assistant',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body
                className={cn(
                    'grainy relative z-0 flex h-full w-full bg-background font-sans antialiased',
                    fontSans.variable
                )}
            >
                <AssistantsProvider>
                    {/* <Header /> */}
                    {children}
                    <Footer />
                </AssistantsProvider>
            </body>
        </html>
    )
}

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './styles/globals.css';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AssistantsProvider from '@/app/AssistantsContext';

export const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'GptnomicsGPT',
    description: 'GPTs Assistant',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body
                className={cn(
                    'relative z-0 flex w-full h-full bg-background font-sans antialiased grainy',
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
    );
}

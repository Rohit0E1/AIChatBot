import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Navbar from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import Chat from '@/components/chat'
import { AIFormProvider } from '@/context/AIFormContext'
import { FocusProvider } from '@/context/FocusContext'
import { ClickProvider } from '@/context/ClickContext'
import FocusOverlay from '@/components/FocusOverlay'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: 'Portfolio App',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AIFormProvider>
            <FocusProvider>
              <ClickProvider>
                <Navbar />
                <main className="min-h-screen pt-16">
                  {children}
                </main>
                <FocusOverlay />
                <Chat />
                <Analytics />
              </ClickProvider>
            </FocusProvider>
          </AIFormProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
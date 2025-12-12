// pages/_app.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }) {
    const router = useRouter()

    // Effet pour suivre les changements de route
    useEffect(() => {
        console.log('Route changée :', router.pathname)
    }, [router.pathname])

    return (
        <ThemeProvider attribute="class" defaultTheme="light">
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp

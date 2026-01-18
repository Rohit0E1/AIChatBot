"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <main
      className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {children}
    </main>
  )
}

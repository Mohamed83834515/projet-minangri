import { useEffect } from 'react'

type AuthLayoutProps = { children: React.ReactNode }

export function AuthLayout({ children }: AuthLayoutProps) {
  useEffect(() => {
    const html = document.documentElement
    const previousClass = html.className

    html.classList.remove('dark')
    html.classList.add('light')

    return () => {
      html.className = previousClass
    }
  }, [])
  return <>{children}</>
}

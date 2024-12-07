'use client'

import Link from 'next/link'
import { CONFIG } from '@/lib/config'
import { usePathname } from 'next/navigation'
import { useNavigation } from '@/contexts/navigation'

export function Header() {
  const pathname = usePathname()
  const { currentCompany, currentNewsletter } = useNavigation()
  
  const getNavigation = () => {
    if (pathname === '/') {
      return {
        section: 'home',
        entity: null
      }
    }
    
    if (pathname.startsWith('/company/') && currentCompany) {
      return {
        section: 'company' as const,
        entity: currentCompany
      }
    }
    
    if (pathname.startsWith('/newsletter/') && currentNewsletter) {
      return {
        section: 'newsletter' as const,
        entity: currentNewsletter
      }
    }
    
    return {
      section: 'home',
      entity: null
    }
  }

  const { section, entity } = getNavigation()

  const renderNavItem = () => {
    switch (section) {
      case 'company':
        return (
          <>
            <Link href="/">{CONFIG.APP.name}</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">
              Company: {entity?.name || 'Loading...'}
            </span>
          </>
        )
      case 'newsletter':
        return (
          <>
            <Link href="/">{CONFIG.APP.name}</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">
              Newsletter: {entity?.name || 'Loading...'}
            </span>
          </>
        )
      default:
        return <Link href="/">{CONFIG.APP.name}</Link>
    }
  }

  return (
    <header className="border-b">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={CONFIG.COMPANY.homepage}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {CONFIG.COMPANY.name}
          </Link>
          <span className="text-muted-foreground">/</span>
          {renderNavItem()}
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

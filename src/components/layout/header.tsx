'use client'

import Link from 'next/link'
import { CONFIG } from '@/lib/config'
import { usePathname, useParams } from 'next/navigation'
import { companies, newsletters } from '@/lib/mock/generateMockData'

export function Header() {
  const pathname = usePathname()
  const params = useParams()
  
  // Determine current section and entity based on path
  const getNavigation = () => {
    if (pathname === '/') {
      return {
        section: 'home',
        entity: null
      }
    }
    
    if (pathname.startsWith('/company/')) {
      const company = companies.find(c => c.slug === params.slug)
      return {
        section: 'company',
        entity: company
      }
    }
    
    if (pathname.startsWith('/newsletter/')) {
      const newsletter = newsletters.find(n => n.slug === params.slug)
      return {
        section: 'newsletter',
        entity: newsletter
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
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {CONFIG.APP.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">
              Company: {entity?.name || 'Loading...'}
            </span>
          </>
        )
      case 'newsletter':
        return (
          <>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {CONFIG.APP.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">
              Newsletter: {entity?.name || 'Loading...'}
            </span>
          </>
        )
      default:
        return (
          <Link
            href="/"
            className="font-semibold hover:text-primary transition-colors"
          >
            {CONFIG.APP.name}
          </Link>
        )
    }
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Documentation
          </Link>
        </nav>
      </div>
    </header>
  )
}

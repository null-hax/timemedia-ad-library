import Link from 'next/link'
import { CONFIG } from '@/lib/config'

export function Header() {
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
          <Link
            href="/"
            className="font-semibold hover:text-primary transition-colors"
          >
            {CONFIG.APP.name}
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/docs"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Documentation
          </Link>
        </nav>
      </div>
    </header>
  )
}

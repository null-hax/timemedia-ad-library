import Link from 'next/link'
import { CONFIG } from '@/lib/config'

export function Footer() {
  return (
    <footer className="border-t py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">{CONFIG.COMPANY.name}</h3>
            <p className="text-sm text-muted-foreground">
              {CONFIG.APP.description}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={CONFIG.SOCIAL.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href={CONFIG.SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {CONFIG.COMPANY.name}. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}

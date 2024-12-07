import { formatDate } from '@/lib/utils'
import type { Ad } from '@/types/ads'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewsletterListModal } from '@/components/NewsletterListModal'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { slugify } from '@/lib/services/companies'

interface AdCardProps {
  ad: Ad
  onTagClick?: (tag: string) => void
}

export function AdCard({ ad, onTagClick }: AdCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <Link
                href={`/company/${ad.company.slug}`}
                className="inline-block transition-colors"
              >
                <h3 className="font-semibold text-lg">{ad.companyName}</h3>
              </Link>
              {ad.readMoreLink && (
                <a
                  href={ad.readMoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="View original ad"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            {ad.company.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {ad.company.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => onTagClick?.(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4" title={ad.adCopy}>
          {ad.adCopy}
        </p>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Seen on {formatDate(ad.date)}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Appeared in{' '}
              <Link 
                href={`/newsletter/${slugify(ad.newsletterName)}`} 
                className="underline hover:text-orange-500 transition-colors"
              >
                {ad.newsletterName}
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

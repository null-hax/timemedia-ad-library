import { formatDate } from '@/lib/utils'
import type { Ad } from '@/types/ads'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewsletterListModal } from '@/components/NewsletterListModal'
import Image from 'next/image'
import Link from 'next/link'
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
            <Link
              href={`/company/${ad.company.slug}`}
              className="inline-block"
            >
              <h3 className="font-semibold text-lg">{ad.companyName}</h3>
            </Link>
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
          {/* {ad.image && (
            <div className="flex-shrink-0">
              <Image
                src={ad.image}
                alt={ad.companyName}
                width={48}
                height={48}
                className="rounded-md"
              />
            </div>
          )} */}
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
                className="underline hover:text-primary transition-colors"
              >
                {ad.newsletterName}
              </Link>
            </div>
            {/* <div className="space-y-1">
              {topNewsletters.map((newsletter) => (
                <Link
                  key={newsletter.id}
                  href={`/newsletter/${newsletter.slug}`}
                  className="block text-sm"
                >
                  {newsletter.name}
                </Link>
              ))}
              {ad.newsletters.length > 3 && (
                <NewsletterListModal newsletters={ad.newsletters} />
              )}
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

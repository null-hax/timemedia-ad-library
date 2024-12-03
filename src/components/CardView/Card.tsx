import { formatDate } from '@/lib/utils'
import type { Ad } from '@/types/ads'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewsletterListModal } from '@/components/NewsletterListModal'
import Image from 'next/image'
import Link from 'next/link'

interface AdCardProps {
  ad: Ad
  onTagClick?: (tag: string) => void
}

export function AdCard({ ad, onTagClick }: AdCardProps) {
  const topNewsletters = [...ad.newsletters]
    .sort((a, b) => a.traffic_rank - b.traffic_rank)
    .slice(0, 3)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <Link
              href={`/company/${ad.company.slug}`}
              className="inline-block hover:text-blue-600"
            >
              <h3 className="font-semibold text-lg">{ad.companyName}</h3>
            </Link>
            <div className="flex flex-wrap gap-1 mt-2">
              {ad.company.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => onTagClick?.(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          {ad.image && (
            <div className="flex-shrink-0">
              <Image
                src={ad.image}
                alt={ad.companyName}
                width={48}
                height={48}
                className="rounded-md"
              />
            </div>
          )}
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
              Appeared in {ad.newsletters.length} newsletters:
            </div>
            <div className="space-y-1">
              {topNewsletters.map((newsletter) => (
                <Link
                  key={newsletter.id}
                  href={`/newsletter/${newsletter.slug}`}
                  className="block text-sm hover:text-blue-600"
                >
                  {newsletter.name}
                </Link>
              ))}
              {ad.newsletters.length > 3 && (
                <NewsletterListModal newsletters={ad.newsletters} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

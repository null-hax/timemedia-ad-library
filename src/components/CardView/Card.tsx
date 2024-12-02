import { formatDate } from '@/lib/utils'
import type { Ad } from '@/types/ads'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface AdCardProps {
  ad: Ad
}

export function AdCard({ ad }: AdCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{ad.companyName}</h3>
            <p className="text-sm text-muted-foreground">
              First seen: {formatDate(ad.firstSeen)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4" title={ad.adCopy}>
          {ad.adCopy}
        </p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Last seen: {formatDate(ad.lastSeen)}</div>
          <div>{ad.newsletterCount.toLocaleString()} newsletters</div>
        </div>
      </CardContent>
    </Card>
  )
}

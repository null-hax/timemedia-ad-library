import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Newsletter } from "@/types/ads"
import Link from "next/link"

interface NewsletterListModalProps {
  newsletters: Newsletter[]
}

export function NewsletterListModal({ newsletters }: NewsletterListModalProps) {
  const sortedNewsletters = [...newsletters].sort((a, b) => a.traffic_rank - b.traffic_rank)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          +{newsletters.length - 3} more
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>All Newsletters</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ul className="space-y-3">
            {sortedNewsletters.map(newsletter => (
              <li key={newsletter.id} className="flex items-center justify-between">
                <Link 
                  href={`/newsletter/${newsletter.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {newsletter.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  Rank #{newsletter.traffic_rank}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
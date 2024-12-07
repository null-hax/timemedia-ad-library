import { getNewsletterBySlug, getNewsletterMentions } from '@/lib/services/newsletters'
import { notFound } from 'next/navigation'
import { NewsletterView } from './components/NewsletterView'
import { NavigationSetter } from '@/components/NavigationSetter'

interface PageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function NewsletterPage({
  params
}: PageProps) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  
  const newsletter = await getNewsletterBySlug(decodedSlug)
  
  if (!newsletter) {
    notFound()
  }

  const mentions = await getNewsletterMentions(newsletter.from_name)

  return (
    <>
      <NavigationSetter 
        newsletter={{
          name: newsletter.from_name,
          slug: decodedSlug
        }}
      />
      <NewsletterView 
        newsletter={newsletter}
        mentions={mentions}
      />
    </>
  )
}

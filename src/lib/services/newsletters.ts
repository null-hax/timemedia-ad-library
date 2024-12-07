import { createServerClient } from '@/lib/supabase/server'
import { Ad } from '@/types/ads'

export type Newsletter = {
  id: string
  from_name: string
  date: string
  text_body: string | null
  created_at: string
  read_more_link: string | null
  description: string | null
  tags: string[]
  name: string
  slug: string
  traffic_rank?: number
}

type MentionWithCompany = {
  id: any
  date: string
  newsletter_name: string
  company_id: string | number
  companies: {
    company_name: string
  }
  description: string
  link: string
  ad_copy: string | null
  created_at: string
  read_more_link?: string
}

export const createServerSupabase = async () => {
  const { cookies } = await import('next/headers')
  return createServerClient(cookies())
}

export const getNewsletterBySlug = async (slug: string) => {
  const supabase = await createServerSupabase()
  
  // Convert slug back to newsletter name for lookup
  const newsletterName = slug.replace(/-/g, ' ')
  
  // Get basic newsletter info
  const { data: newsletter, error } = await supabase
    .from('newsletter_monitor')
    .select('*')
    .ilike('from_name', newsletterName)
    .limit(1)
    .single()

  if (error || !newsletter) {
    console.error('Error fetching newsletter:', error)
    return null
  }

  // Get additional newsletter metadata
  const { data: metadata, error: metadataError } = await supabase
    .from('monitored_newsletters')
    .select('description, tags')
    .ilike('company_name', newsletterName)
    .single()

  if (metadataError) {
    console.error('Error fetching newsletter metadata:', metadataError)
  }

  // Safely parse tags
  let parsedTags: string[] = []
  try {
    if (metadata?.tags) {
      parsedTags = Array.isArray(metadata.tags) ? metadata.tags : JSON.parse(metadata.tags)
    }
  } catch (e) {
    console.error('Error parsing tags:', e)
  }

  // Transform to match expected Newsletter type
  return {
    id: newsletter.id.toString(),
    name: newsletter.from_name,
    slug: slug,
    description: metadata?.description || newsletter.text_body || '',
    tags: parsedTags,
    traffic_rank: 0,
    from_name: newsletter.from_name,
    date: newsletter.date,
    text_body: newsletter.text_body,
    created_at: newsletter.created_at,
    read_more_link: newsletter.read_more_link
  }
}

export const getNewsletterMentions = async (newsletterName: string): Promise<Ad[]> => {
  const supabase = await createServerSupabase()
  
  // Simply fetch mentions for the newsletter
  const { data: mentions, error } = await supabase
    .from('mentions')
    .select(`
      id,
      date,
      newsletter_name,
      company_id,
      company_name,
      description,
      link,
      ad_copy,
      read_more_link
    `)
    .eq('newsletter_name', newsletterName)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching newsletter mentions:', error)
    return []
  }

  // Transform mentions directly to Ad type
  return mentions.map(mention => {
    const companyName = mention.company_name || 'Unknown Company'
    const companySlug = companyName.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    
    return {
      id: mention.id.toString(),
      companyName,
      companyId: mention.company_id?.toString(),
      adCopy: mention.ad_copy || '',
      date: mention.date,
      newsletterName: mention.newsletter_name,
      company: {
        id: mention.company_id?.toString(),
        name: companyName,
        slug: companySlug,
        tags: [], // Since we don't need tags for the newsletter view
      },
      link: mention.link,
      readMoreLink: mention.read_more_link || mention.link,
      image: ''
    }
  })
} 
import { createServerClient } from './server'
import { Ad } from '@/types/ads'
import { cache } from 'react'

export const getAds = cache(async (): Promise<Ad[]> => {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('company_news')
    .select()
    .eq('category', 'sponsor')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching ads:', error)
    return []
  }

  return data.map((item): Ad => ({
    id: item.id.toString(),
    companyName: item.company_name,
    companyId: `company-${item.id}`,
    adCopy: item.description,
    date: item.date,
    newsletters: [], // To be populated if needed
    company: {
      id: `company-${item.id}`,
      name: item.company_name,
      slug: item.company_name.toLowerCase().replace(/\s+/g, '-'),
      tags: [],
      description: item.description,
      image: `https://picsum.photos/200?grayscale`,
    },
    image: `https://picsum.photos/200?grayscale`,
    link: item.link,
    readMoreLink: item.read_more_link,
  }))
}) 
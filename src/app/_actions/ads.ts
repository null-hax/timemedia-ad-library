'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import type { Ad } from '@/types/ads'

export async function getServerAds(): Promise<Ad[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)
    
    const { data, error } = await supabase
      .from('mentions')
      .select(`
        id,
        newsletter_name,
        date,
        company_name,
        category,
        link,
        description,
        read_more_link,
        ad_copy
      `)
      .eq('category', 'sponsor')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching data:', error)
      throw new Error(`Data fetch failed: ${error.message}`)
    }

    if (!data) {
      console.error('No data returned from Supabase')
      return []
    }

    return data.map((item): Ad => ({
      id: item.id.toString(),
      companyName: item.company_name,
      companyId: `company-${item.id}`,
      adCopy: item.ad_copy || item.description || '',
      date: item.date,
      newsletterName: item.newsletter_name,
      company: {
        id: `company-${item.id}`,
        name: item.company_name,
        slug: item.company_name.toLowerCase().replace(/\s+/g, '-'),
        tags: [],
        description: item.description || '',
        image: `https://picsum.photos/200?grayscale`,
      },
      image: `https://picsum.photos/200?grayscale`,
      link: item.link || '',
      readMoreLink: item.read_more_link || '',
    }));

  } catch (err) {
    console.error('Detailed error in getServerAds:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    })
    throw err
  }
} 
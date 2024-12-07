import { createServerClient } from '@/lib/supabase/server'
import { USE_SUPABASE } from '@/lib/config'
import { marked } from 'marked'
import { Ad } from '@/types/ads'
import { mockCompanyData, mockRelatedCompanies, generateMockMentions } from '@/lib/mocks/companyMock'

export type CompanyData = {
  id: number
  company_name: string
  description: string
  related_companies: number[]
  tags: string[]
  appeared_in: Record<string, number>
  audience_profile: string
  market_overview: string
  image?: string
}

export type RelatedCompany = Pick<CompanyData, 'id' | 'company_name' | 'description'>

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export const createServerSupabase = async () => {
  const { cookies } = await import('next/headers')
  return createServerClient(cookies())
}

export const getCompanyBySlug = async (slug: string) => {
  const supabase = await createServerSupabase()
  
  // First find company by slugified name - case insensitive
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('company_name', slug.replace(/-/g, ' '))
    .single()

  if (error || !company) {
    // Instead of returning null, return mock data with a flag
    return {
      ...mockCompanyData,
      isDemo: true
    }
  }

  // Parse fields
  try {
    return {
      ...company,
      tags: typeof company.tags === 'string' ? JSON.parse(company.tags) : company.tags,
      related_companies: company.related_companies ? 
        company.related_companies.split(',').map((id: string) => parseInt(id.trim(), 10)) : 
        [],
      appeared_in: typeof company.appeared_in === 'string'
        ? JSON.parse(company.appeared_in)
        : company.appeared_in,
      audience_profile: company.audience_profile ? marked(company.audience_profile) : '',
      isDemo: false
    }
  } catch (e) {
    console.error('Error parsing company data:', e)
    return {
      ...mockCompanyData,
      isDemo: true
    }
  }
}

export const getRelatedCompanies = async (companyIds: number[]): Promise<RelatedCompany[]> => {
  if (!companyIds?.length) return []
  
  // If it's a demo company, return mock related companies
  if (companyIds.includes(0)) {
    return mockRelatedCompanies
  }

  const supabase = await createServerSupabase()
  
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, company_name, description')
    .in('id', companyIds)
    .limit(2)

  if (error) {
    console.error('Error fetching related companies:', error)
    return []
  }

  return companies.map(company => ({
    id: typeof company.id === 'string' ? parseInt(company.id, 10) : company.id,
    company_name: company.company_name,
    description: company.description || ''
  }))
}

export const transformMentionToAd = (mention: any): Ad => ({
  id: mention.id.toString(),
  companyName: mention.company_name,
  companyId: mention.company_id.toString(),
  adCopy: mention.ad_copy || '',
  date: mention.date,
  newsletterName: mention.newsletter_name,
  company: {
    id: mention.company_id.toString(),
    name: mention.company_name,
    slug: slugify(mention.company_name),
    tags: [],
  },
  link: mention.link,
  readMoreLink: mention.read_more_link || mention.link,
  image: ''
})

export const getCompanyMentions = async (companyId: number): Promise<Ad[]> => {
  // If it's a demo company, return mock mentions
  if (companyId === 0) {
    return generateMockMentions()
  }

  const supabase = await createServerSupabase()
  
  const { data: mentions, error } = await supabase
    .from('mentions')
    .select('*')
    .eq('company_id', companyId)
    .order('date', { ascending: true })

  if (error) return []
  
  return mentions.map(transformMentionToAd)
} 
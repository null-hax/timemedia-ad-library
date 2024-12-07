import { getCompanyBySlug, getRelatedCompanies, getCompanyMentions } from '@/lib/services/companies'
import { notFound } from 'next/navigation'
import { CompanyView } from './components/CompanyView'
import { NavigationSetter } from '@/components/NavigationSetter'

interface PageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CompanyPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  
  const company = await getCompanyBySlug(decodedSlug)
  
  if (!company) {
    notFound()
  }

  const relatedCompanies = await getRelatedCompanies(company.related_companies)
  const mentions = await getCompanyMentions(company.id)

  return (
    <>
      <NavigationSetter 
        company={{
          name: company.company_name,
          slug: decodedSlug
        }}
      />
      <CompanyView 
        company={company}
        relatedCompanies={relatedCompanies}
        mentions={mentions}
      />
    </>
  )
}

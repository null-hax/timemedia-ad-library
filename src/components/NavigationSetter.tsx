'use client'

import { useEffect } from 'react'
import { useNavigation } from '@/contexts/navigation'

type NavigationSetterProps = {
  company?: {
    name: string
    slug: string
  }
  newsletter?: {
    name: string
    slug: string
  }
}

export function NavigationSetter({ company, newsletter }: NavigationSetterProps) {
  const { setCurrentCompany, setCurrentNewsletter } = useNavigation()

  useEffect(() => {
    if (company) {
      setCurrentCompany(company)
      return () => setCurrentCompany(undefined)
    }
    if (newsletter) {
      setCurrentNewsletter(newsletter)
      return () => setCurrentNewsletter(undefined)
    }
  }, [company, newsletter, setCurrentCompany, setCurrentNewsletter])

  return null
} 
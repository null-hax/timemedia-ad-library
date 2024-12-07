'use client'

import { useEffect } from 'react'
import { useNavigation } from '@/contexts/navigation'

type NavigationSetterProps = {
  company: {
    name: string
    slug: string
  }
}

export function NavigationSetter({ company }: NavigationSetterProps) {
  const { setCurrentCompany } = useNavigation()

  useEffect(() => {
    setCurrentCompany(company)
    return () => setCurrentCompany(undefined)
  }, [company, setCurrentCompany])

  return null
} 
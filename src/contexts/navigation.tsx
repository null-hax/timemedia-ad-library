'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

type Company = {
  name: string
  slug: string
}

type Newsletter = {
  name: string
  slug: string
}

type NavigationContextType = {
  currentCompany?: Company
  currentNewsletter?: Newsletter
  setCurrentCompany: (company: Company | undefined) => void
  setCurrentNewsletter: (newsletter: Newsletter | undefined) => void
}

const NavigationContext = createContext<NavigationContextType>({
  setCurrentCompany: () => {},
  setCurrentNewsletter: () => {}
})

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentCompany, setCurrentCompany] = useState<Company | undefined>()
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | undefined>()

  return (
    <NavigationContext.Provider 
      value={{ 
        currentCompany, 
        currentNewsletter,
        setCurrentCompany,
        setCurrentNewsletter 
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => useContext(NavigationContext) 
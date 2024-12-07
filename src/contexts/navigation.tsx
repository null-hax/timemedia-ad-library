'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

type Company = {
  name: string
  slug: string
}

type NavigationContextType = {
  currentCompany?: Company
  setCurrentCompany: (company: Company | undefined) => void
}

const NavigationContext = createContext<NavigationContextType>({
  setCurrentCompany: () => {}
})

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentCompany, setCurrentCompany] = useState<Company | undefined>()

  return (
    <NavigationContext.Provider value={{ currentCompany, setCurrentCompany }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => useContext(NavigationContext) 
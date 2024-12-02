'use client'

import { useCallback, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export function useUrlState<T>(key: string, defaultValue: T) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [state, setState] = useState<T>(() => {
    const param = searchParams.get(key)
    if (!param) return defaultValue
    try {
      return JSON.parse(param) as T
    } catch {
      return defaultValue
    }
  })

  const setValue = useCallback(
    (newValue: T) => {
      setState(newValue)
      const params = new URLSearchParams(searchParams.toString())

      if (newValue === defaultValue) {
        params.delete(key)
      } else {
        params.set(key, JSON.stringify(newValue))
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [key, defaultValue, pathname, router, searchParams]
  )

  return [state, setValue] as const
}

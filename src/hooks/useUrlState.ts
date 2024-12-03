'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Route } from 'next'

export function useUrlState<T>(key: string, initialState: T) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Initialize state from URL or default
  const [state, setState] = useState<T>(() => {
    const paramValue = searchParams.get(key)
    if (paramValue) {
      try {
        return JSON.parse(paramValue) as T
      } catch {
        return initialState
      }
    }
    return initialState
  })

  // Memoize the URL update function
  const updateUrl = useCallback(
    (newState: T) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, JSON.stringify(newState))
      router.push((pathname + '?' + params.toString()) as Route)
    },
    [key, pathname, router, searchParams]
  )

  // Update URL when state changes
  useEffect(() => {
    updateUrl(state)
  }, [state, updateUrl])

  return [
    state,
    (newState: T | ((prev: T) => T)) => {
      setState(
        typeof newState === 'function' ? (newState as (prev: T) => T) : newState
      )
    },
  ] as const
}

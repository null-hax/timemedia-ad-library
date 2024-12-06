import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'
import type { cookies } from 'next/headers'

// Type for the cookies() function from next/headers
type CookieGetter = typeof cookies

// Create a function that takes cookies as an argument
export const createServerClient = (cookieStore: ReturnType<CookieGetter>) => {
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
} 
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    const date = parseISO(dateStr)
    return format(date, 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sanitizeString(str: string): string {
  return str
    .replace(/['']/g, '\'')  // Replace smart quotes with straight quotes
    .replace(/[""]/g, '"')   // Replace smart double quotes with straight quotes
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { 
    notation: 'compact',
    maximumFractionDigits: 1 
  }).format(num)
}

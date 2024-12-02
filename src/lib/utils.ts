import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  try {
    const date = parseISO(dateStr)
    return format(date, 'MMM d, yyyy')
  } catch (error) {
    console.error('Error formatting date:', dateStr, error)
    return dateStr
  }
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

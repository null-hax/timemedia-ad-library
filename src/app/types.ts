declare module 'next/link' {
  interface RouteTypes {
    '/company/[id]': { id: string }
    '/newsletter/[id]': { id: string }
  }
} 
declare module 'next/link' {
  interface RouteTypes {
    '/company/[slug]': { slug: string }
    '/newsletter/[slug]': { slug: string }
  }
}

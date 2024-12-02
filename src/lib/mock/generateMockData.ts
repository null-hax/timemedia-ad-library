import { Ad } from '@/types/ads'

const companies = [
  'Apple',
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'Netflix',
  'Tesla',
  'Adobe',
  'Spotify',
  'Twitter',
]

const adCopyTemplates = [
  'Discover the new {product} - Revolutionary design meets exceptional performance',
  'Introducing {product} - The future of technology is here',
  'Experience the difference with {product}',
  'Transform your life with {product}',
  'The all-new {product} - Redefining excellence',
]

const products = [
  'iPhone',
  'Pixel',
  'Surface',
  'Echo',
  'Quest',
  'Smart TV',
  'Model Y',
  'Creative Suite',
  'Premium',
  'Blue',
]

function randomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString()
}

function generateMockAd(): Ad {
  const companyIndex = Math.floor(Math.random() * companies.length)
  const adTemplate =
    adCopyTemplates[Math.floor(Math.random() * adCopyTemplates.length)]
  const product = products[Math.floor(Math.random() * products.length)]

  const firstSeen = randomDate(new Date(2023, 0, 1), new Date())
  const lastSeen = randomDate(new Date(firstSeen), new Date())

  return {
    id: Math.random().toString(36).substr(2, 9),
    companyName: companies[companyIndex],
    adCopy: adTemplate.replace('{product}', product),
    mentions: Math.floor(Math.random() * 1000) + 1,
    firstSeen,
    lastSeen,
    newsletterCount: Math.floor(Math.random() * 50) + 1,
  }
}

export function generateMockAds(count: number = 20): Ad[] {
  return Array.from({ length: count }, generateMockAd)
}

import { Ad, Newsletter, Company } from '@/types/ads'

// Mock newsletters with traffic ranks
const newsletters = [
  { id: 'n1', name: 'The Hustle', description: 'Daily business and tech news', traffic_rank: 1 },
  { id: 'n2', name: 'Morning Brew', description: 'Daily business news digest', traffic_rank: 2 },
  { id: 'n3', name: 'TLDR', description: 'Tech news for developers', traffic_rank: 3 },
  { id: 'n4', name: 'Platformer', description: 'Tech and platform news', traffic_rank: 4 },
  { id: 'n5', name: 'Fintech Today', description: 'Financial technology news', traffic_rank: 5 },
  { id: 'n6', name: 'StrictlyVC', description: 'Venture capital news', traffic_rank: 6 },
  { id: 'n7', name: 'Benedict\'s Newsletter', description: 'Tech analysis', traffic_rank: 7 },
  { id: 'n8', name: 'Web3 Daily', description: 'Crypto and web3 news', traffic_rank: 8 },
  { id: 'n9', name: 'Milk Road', description: 'Crypto market updates', traffic_rank: 9 },
  { id: 'n10', name: 'DeFi Weekly', description: 'Decentralized finance news', traffic_rank: 10 },
].map(n => ({ ...n, id: Math.random().toString(36).substr(2, 9) })) as Newsletter[]

// Companies with tags
const companies: Company[] = [
  {
    id: 'c1',
    name: 'Apple',
    tags: ['tech', 'consumer electronics', 'mobile'],
    description: 'Consumer electronics and software',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c2',
    name: 'Google',
    tags: ['tech', 'software', 'advertising'],
    description: 'Search and advertising technology',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c3',
    name: 'Microsoft',
    tags: ['tech', 'software', 'cloud'],
    description: 'Software and cloud services',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c4',
    name: 'Amazon',
    tags: ['tech', 'ecommerce', 'cloud'],
    description: 'E-commerce and cloud computing',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c5',
    name: 'Meta',
    tags: ['tech', 'social media', 'advertising'],
    description: 'Social media and virtual reality',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c6',
    name: 'Coinbase',
    tags: ['crypto', 'fintech', 'exchange'],
    description: 'Cryptocurrency exchange',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c7',
    name: 'Binance',
    tags: ['crypto', 'fintech', 'exchange'],
    description: 'Cryptocurrency exchange',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c8',
    name: 'Nike',
    tags: ['retail', 'fashion', 'sports'],
    description: 'Sports apparel and equipment',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c9',
    name: 'Adidas',
    tags: ['retail', 'fashion', 'sports'],
    description: 'Sports apparel and equipment',
    image: 'https://picsum.photos/200?grayscale'
  },
  {
    id: 'c10',
    name: 'Tesla',
    tags: ['tech', 'automotive', 'energy'],
    description: 'Electric vehicles and energy',
    image: 'https://picsum.photos/200?grayscale'
  },
].map(c => ({ ...c, id: Math.random().toString(36).substr(2, 9) }))

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

function getRandomNewsletters(min: number = 1, max: number = 5): Newsletter[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...newsletters].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateMockAd(): Ad {
  const company = companies[Math.floor(Math.random() * companies.length)]
  const adTemplate = adCopyTemplates[Math.floor(Math.random() * adCopyTemplates.length)]
  const product = products[Math.floor(Math.random() * products.length)]

  return {
    id: Math.random().toString(36).substr(2, 9),
    companyName: company.name,
    companyId: company.id,
    adCopy: adTemplate.replace('{product}', product),
    date: randomDate(new Date(2023, 0, 1), new Date()),
    newsletters: getRandomNewsletters(),
    company,
    image: company.image,
  }
}

export function generateMockAds(count: number = 20): Ad[] {
  return Array.from({ length: count }, generateMockAd)
}

// Export these for use in other parts of the application
export { newsletters, companies }

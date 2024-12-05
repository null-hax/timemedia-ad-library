import { Ad, Newsletter, Company } from '@/types/ads'
import { slugify, sanitizeString } from '@/lib/utils'
import { cache } from 'react'

// Mock newsletters with traffic ranks
const newsletters = [
  {
    id: 'n1',
    name: 'The Hustle',
    description: 'A daily business newsletter delivering concise, witty breakdowns of the most important tech and business news to over 2M+ professionals.',
    traffic_rank: 1,
  },
  {
    id: 'n2',
    name: 'Morning Brew',
    description: 'The daily newsletter revolutionizing business news for millennials, covering markets, tech, and entrepreneurship in an engaging, conversational style.',
    traffic_rank: 2,
  },
  {
    id: 'n3',
    name: 'TLDR',
    description: 'A byte-sized tech newsletter delivering the most important technology news and developments to software developers and tech professionals daily.',
    traffic_rank: 3,
  },
  {
    id: 'n4',
    name: 'Platformer',
    description: 'Critical analysis of big tech and democracy from Casey Newton, featuring deep dives into social networks, content moderation, and tech policy.',
    traffic_rank: 4,
  },
  {
    id: 'n5',
    name: 'Fintech Today',
    description: 'Premium insights on fintech innovation, digital banking trends, and the future of financial services for industry professionals and investors.',
    traffic_rank: 5,
  },
  {
    id: 'n6',
    name: 'StrictlyVC',
    description: 'Essential daily reading for venture capitalists and startup founders, featuring exclusive deals, fundraising news, and industry analysis.',
    traffic_rank: 6,
  },
  {
    id: 'n7',
    name: "Benedict's Newsletter",
    description: 'In-depth analysis of tech trends and their broader impact on society, business, and innovation from Benedict Evans, former a16z partner.',
    traffic_rank: 7,
  },
  {
    id: 'n8',
    name: 'Web3 Daily',
    description: 'Comprehensive coverage of blockchain technology, cryptocurrencies, NFTs, and decentralized finance for both crypto natives and newcomers.',
    traffic_rank: 8,
  },
  {
    id: 'n9',
    name: 'Milk Road',
    description: 'Daily crypto newsletter bringing humor and simplicity to complex crypto topics, featuring market analysis and emerging opportunities.',
    traffic_rank: 9,
  },
  {
    id: 'n10',
    name: 'DeFi Weekly',
    description: 'Weekly deep dives into decentralized finance protocols, yield farming strategies, and the latest innovations in the DeFi ecosystem.',
    traffic_rank: 10,
  },
].map((n) => ({ ...n, slug: slugify(n.name) })) as Newsletter[]

// Companies with tags
const companies: Company[] = [
  {
    id: 'c1',
    name: 'Apple',
    slug: 'apple',
    tags: ['tech', 'consumer electronics', 'mobile'],
    description: 'A leading technology company known for innovative consumer electronics, including the iPhone, Mac computers, and wearables, with a strong focus on premium design, seamless ecosystem integration, and privacy-first approach.',
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c2',
    name: 'Google',
    slug: 'google',
    tags: ['tech', 'software', 'advertising'],
    description: 'Global technology leader specializing in internet-related services, cloud computing, AI research, and online advertising technologies, powering the world\'s most popular search engine and mobile operating system.',
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c3',
    name: 'Microsoft',
    slug: 'microsoft',
    tags: ['tech', 'software', 'cloud'],
    description: 'Enterprise technology giant providing cloud computing services, productivity software, and development tools, while leading innovation in artificial intelligence and gaming through Xbox and Azure platforms.',
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c4',
    name: 'Amazon',
    slug: 'amazon',
    tags: ['tech', 'ecommerce', 'cloud'],
    description: sanitizeString('World\'s largest e-commerce platform and cloud services provider, revolutionizing retail, entertainment, and enterprise computing through AWS, while pushing boundaries in AI with Alexa and automation.'),
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c5',
    name: 'Meta',
    slug: 'meta',
    tags: ['tech', 'social media', 'advertising'],
    description: 'Social technology company building the metaverse while operating the world\'s largest social platforms including Facebook, Instagram, and WhatsApp, with a focus on connecting people and advancing VR/AR technologies.',
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c6',
    name: 'Coinbase',
    slug: 'coinbase',
    tags: ['crypto', 'fintech', 'exchange'],
    description: 'Leading cryptocurrency exchange platform providing secure trading and storage of digital assets, while building infrastructure for the crypto economy through institutional services and developer tools.',
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c7',
    name: 'Binance',
    slug: 'binance',
    tags: ['crypto', 'fintech', 'exchange'],
    description: 'World\'s largest cryptocurrency exchange by trading volume, offering a comprehensive ecosystem of crypto products including trading, staking, NFTs, and innovative blockchain solutions.',
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c8',
    name: 'Nike',
    slug: 'nike',
    tags: ['retail', 'fashion', 'sports'],
    description: 'Global leader in athletic footwear, apparel, and sports equipment, known for innovative product design, powerful marketing campaigns, and digital-first approach to retail through Nike Direct and SNKRS platform.',
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c9',
    name: 'Adidas',
    slug: 'adidas',
    tags: ['retail', 'fashion', 'sports'],
    description: 'International sporting goods manufacturer combining performance technology with streetwear culture, focusing on sustainability and digital innovation while collaborating with athletes and cultural icons.',
    image: 'https://picsum.photos/200?grayscale',
  },
  {
    id: 'c10',
    name: 'Tesla',
    slug: 'tesla',
    tags: ['tech', 'automotive', 'energy'],
    description: 'Electric vehicle and clean energy company revolutionizing transportation and power generation through advanced battery technology, autonomous driving capabilities, and innovative solar energy solutions.',
    image: 'https://picsum.photos/200?grayscale',
  },
].map((c, index) => ({
  ...c,
  id: `company-${index + 1}`,
  slug: slugify(c.name),
  description: sanitizeString(c.description),
}))

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

// Add a seed function for deterministic random numbers
function seededRandom(seed: number) {
  return function () {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

const getRandom = seededRandom(123) // Fixed seed

// Add a fixed date for server-side rendering
const FIXED_DATE = new Date('2024-10-01').getTime()

function randomDate(start: Date, daysRange: number): string {
  const end = new Date(start)
  end.setDate(end.getDate() + daysRange)

  // Use the seeded random function instead of random dates
  const timestamp = FIXED_DATE + (getRandom() * daysRange * 24 * 60 * 60 * 1000)
  return new Date(timestamp).toISOString()
}

function getRandomNewsletters(min: number = 1, max: number = 10): Newsletter[] {
  const count = Math.floor(getRandom() * (max - min + 1)) + min
  return [...newsletters].sort(() => getRandom() - 0.5).slice(0, count)
}

function generateMockAd(): Ad {
  const company = companies[Math.floor(getRandom() * companies.length)]
  const adTemplate = adCopyTemplates[Math.floor(getRandom() * adCopyTemplates.length)]
  const product = products[Math.floor(getRandom() * products.length)]

  return {
    id: `ad-${Date.now()}-${Math.floor(getRandom() * 1000)}`,
    companyName: company.name,
    companyId: company.id,
    adCopy: adTemplate.replace('{product}', product),
    date: randomDate(
      new Date('2024-10-01T00:00:00Z'),
      90 // Generate dates within a 30-day range from Oct 1st
    ),
    newsletters: getRandomNewsletters(),
    company,
    image: company.image,
  }
}

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

interface CachedData {
  ads: Ad[]
  timestamp: number
}

let mockDataCache: CachedData | null = null

export const generateMockAds = cache((count: number = 20): Ad[] => {
  // Check if we have valid cached data
  if (mockDataCache) {
    const age = Date.now() - mockDataCache.timestamp
    if (age < CACHE_DURATION) {
      return mockDataCache.ads
    }
  }

  // Generate new data
  const ads = Array.from({ length: count }, generateMockAd)

  // Cache the new data
  mockDataCache = {
    ads,
    timestamp: Date.now(),
  }

  return ads
})

// Export these for use in other parts of the application
export { newsletters, companies }

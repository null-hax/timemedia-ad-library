import { Newsletter } from '@/lib/services/newsletters'
import { Ad } from '@/types/ads'
import { subDays } from 'date-fns'

export const mockNewsletterData: Omit<Newsletter, 'isDemo'> = {
  id: "0",
  name: "Demo Newsletter",
  from_name: "Demo Newsletter",
  slug: "demo-newsletter",
  description: "This is a demo newsletter page showing what newsletter insights could look like. Real data for this newsletter is coming soon!",
  tags: ["Tech", "Finance", "Marketing", "Demo"],
  traffic_rank: 0,
  date: new Date().toISOString(),
  text_body: null,
  created_at: new Date().toISOString(),
  read_more_link: null
}

const demoCompanies = [
  {
    id: "1",
    name: "TechCorp AI",
    tags: ["AI", "Enterprise", "SaaS"],
    adCopy: "Join TechCorp's upcoming webinar to discover how AI is transforming enterprise workflows. Learn from industry experts about implementation strategies and ROI optimization."
  },
  {
    id: "2",
    name: "FinanceStream",
    tags: ["Finance", "Technology", "Data"],
    adCopy: "Transform your financial data into actionable insights with FinanceStream's new analytics platform. Start your free trial today."
  },
  {
    id: "3",
    name: "MarketPro",
    tags: ["Marketing", "Analytics", "Digital"],
    adCopy: "Unlock the power of predictive marketing analytics with MarketPro's AI-driven platform. See how leading brands are achieving 3x ROI."
  },
  {
    id: "4",
    name: "CloudScale Solutions",
    tags: ["Cloud", "Infrastructure", "Enterprise"],
    adCopy: "Modernize your infrastructure with CloudScale's enterprise-ready solutions. Book a demo to see our latest features in action."
  },
  {
    id: "5",
    name: "DataSense Analytics",
    tags: ["Analytics", "Business Intelligence", "AI"],
    adCopy: "Turn your data into competitive advantage. DataSense helps you make smarter decisions faster with real-time analytics."
  }
]

export const generateMockNewsletterMentions = (): Ad[] => {
  // Generate base ads (3 ads per company with different dates)
  const baseAds = demoCompanies.flatMap(company => 
    Array.from({ length: 3 }, (_, i) => ({
      id: `mock-${company.id}-${i}`,
      companyName: company.name,
      companyId: company.id,
      adCopy: company.adCopy,
      date: subDays(new Date(), i * 2 + Math.floor(Math.random() * 3)).toISOString(),
      newsletterName: mockNewsletterData.from_name,
      company: {
        id: company.id,
        name: company.name,
        slug: company.name.toLowerCase().replace(/[^\w]+/g, '-'),
        tags: company.tags,
      },
      link: "#",
      readMoreLink: "#",
      image: ""
    }))
  )

  // Generate additional sparse data points for the activity chart
  const chartData = Array.from({ length: 30 }, (_, i) => {
    if (Math.random() > 0.6) { // 40% chance of having an ad on any given day
      const company = demoCompanies[Math.floor(Math.random() * demoCompanies.length)]
      return {
        id: `mock-chart-${i}`,
        companyName: company.name,
        companyId: company.id,
        adCopy: company.adCopy,
        date: subDays(new Date(), i).toISOString(),
        newsletterName: mockNewsletterData.from_name,
        company: {
          id: company.id,
          name: company.name,
          slug: company.name.toLowerCase().replace(/[^\w]+/g, '-'),
          tags: company.tags,
        },
        link: "#",
        readMoreLink: "#",
        image: ""
      }
    }
    return null
  }).filter((item): item is Ad => item !== null) // Type guard to ensure null values are filtered out

  // Combine and sort all ads by date
  return [...baseAds, ...chartData].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
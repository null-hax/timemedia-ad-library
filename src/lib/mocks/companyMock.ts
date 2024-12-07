import { CompanyData, RelatedCompany } from '@/lib/services/companies'
import { Ad } from '@/types/ads'
import { subDays } from 'date-fns'

export const mockCompanyData: CompanyData = {
  id: 0,
  company_name: "Demo Company",
  description: "This is a demo company page showing what company insights could look like. Real data for this company is coming soon!",
  related_companies: [1, 2],
  tags: ["tech", "retail", "demo"],
  appeared_in: {
    "The Neuron": 12,
    "Milk Road": 8,
    "The Rundown AI": 5
  },
  audience_profile: "<p>Demo Company has been targeting newsletters with audiences that fit a <strong>professional marketer profile, who are interested in finance, stock market trends, and practical marketing strategies</strong>.</p>",
  market_overview: "This is a sample market overview showing how we analyze companies in our database. When this company is added to our system, you'll see real competitive intelligence and market analysis here.",
}

export const mockRelatedCompanies: RelatedCompany[] = [
  {
    id: 1,
    company_name: "Sample Competitor 1",
    description: "A demonstration of how competitor insights would appear"
  },
  {
    id: 2,
    company_name: "Sample Competitor 2",
    description: "Another example of competitor analysis presentation"
  }
]

export const generateMockMentions = (): Ad[] => {
  const baseAds = [
    {
      id: 'mock-1',
      companyName: "Demo Company",
      companyId: "0",
      adCopy: "This is a sample ad showing how the company's advertising would be displayed in our system.",
      date: subDays(new Date(), 2).toISOString(),
      newsletterName: "The Neuron",
      company: {
        id: "0",
        name: "Demo Company",
        slug: "demo-company",
        tags: ["Demo"],
      },
      link: "#",
      readMoreLink: "#",
      image: ""
    },
    {
      id: 'mock-2',
      companyName: "Demo Company",
      companyId: "0",
      adCopy: "Another example of how ads appear in our system. This helps demonstrate the layout and information displayed.",
      date: subDays(new Date(), 5).toISOString(),
      newsletterName: "Milk Road",
      company: {
        id: "0",
        name: "Demo Company",
        slug: "demo-company",
        tags: ["Demo"],
      },
      link: "#",
      readMoreLink: "#",
      image: ""
    },
    {
      id: 'mock-3',
      companyName: "Demo Company",
      companyId: "0",
      adCopy: "A third sample ad to show how multiple ads from the same company are displayed in our system.",
      date: subDays(new Date(), 8).toISOString(),
      newsletterName: "The Rundown AI",
      company: {
        id: "0",
        name: "Demo Company",
        slug: "demo-company",
        tags: ["Demo"],
      },
      link: "#",
      readMoreLink: "#",
      image: ""
    }
  ];

  // For the chart data, generate sparse data points over 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    if (Math.random() > 0.7) {
      return {
        ...baseAds[0],
        id: `mock-chart-${i}`,
        date: subDays(new Date(), i).toISOString()
      };
    }
    return null;
  }).filter(Boolean);

  // Return both the base ads for display and the chart data
  return [...baseAds, ...chartData].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
} 
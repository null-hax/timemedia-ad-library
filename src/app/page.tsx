import dynamic from 'next/dynamic'
import { Hero } from '@/components/Hero'

// Dynamically import with proper config
const AdsLibraryClient = dynamic(
  () => import('@/components/AdsLibraryClient').then(mod => mod.default),
  {
    loading: () => <Hero />
  }
)

export default function Page() {
  return <AdsLibraryClient />
}

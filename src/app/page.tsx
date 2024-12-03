import dynamic from 'next/dynamic'

// Dynamically import with proper config
const AdsLibraryClient = dynamic(
  () => import('@/components/AdsLibraryClient').then(mod => mod.default),
  {
    loading: () => <div>Loading...</div>
  }
)

export default function Page() {
  return <AdsLibraryClient />
}

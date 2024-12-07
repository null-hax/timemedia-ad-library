import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="inline-flex items-center rounded-full bg-orange-50 px-6 py-2 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/20 mb-8">
                Beta Access Now Available
              </div>
            </div>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Newsletter{' '}
              <span className="relative">
                <span className="relative inline-block text-orange-500">
                  Ad Library
                  <div className="absolute -bottom-2 left-0 h-1 w-full bg-orange-500/30" />
                </span>
              </span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-xl text-muted-foreground sm:text-2xl md:mt-8 md:max-w-3xl">
              Track and analyze newsletter advertising across industries. Discover trends, monitor competitors, and make data-driven decisions.
            </p>
            
            <div className="relative mt-12">
              {/* Stats grid with enhanced styling */}
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="relative flex flex-col items-center p-6 bg-white/50 rounded-2xl shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-1">
                  <div className="text-4xl font-bold text-orange-500">1000+</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">Newsletters Tracked</div>
                </div>
                <div className="relative flex flex-col items-center p-6 bg-white/50 rounded-2xl shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-1">
                  <div className="text-4xl font-bold text-orange-500">50K+</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">Ads Analyzed</div>
                </div>
                <div className="relative flex flex-col items-center p-6 bg-white/50 rounded-2xl shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-1">
                  <div className="text-4xl font-bold text-orange-500">12</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">Industries Covered</div>
                </div>
                <div className="relative flex flex-col items-center p-6 bg-white/50 rounded-2xl shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-1">
                  <div className="text-4xl font-bold text-orange-500">Real-time</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
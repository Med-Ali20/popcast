export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton - matching actual Hero component structure */}
      <div className="w-full flex items-center justify-center md:mt-[7vw] lg:mt-[5vw]">
        <div className="w-[90%] md:w-[50%] mx-auto font-emirates relative">
          {/* Background matching Hero */}
          <div className="absolute inset-0 bg-[rgba(255,255,255,0.4)] rounded-lg top-[4vw] md:top-[10vw] lg:top-[15vw] animate-pulse"></div>

          {/* Content with relative positioning and padding */}
          <div className="relative flex flex-col p-8 md:pt-0">
            {/* Images container skeleton */}
            <div className="relative w-[70vw] z-20 md:w-[53vw] ml-[10%] -mr-[40%] md:-ml-[10%] lg:-ml-[7%] aspect-video min-h-[300px]">
              {/* Multiple overlapping image placeholders */}
              <div className="absolute w-full top-[0] left-[40%] md:-top-[20%] md:left-1/2 -translate-x-1/2">
                <div className="w-full h-full bg-primary/10 rounded-lg animate-pulse" />
              </div>
              
              <div className="absolute w-3/5 top-[5%] left-[15%] md:w-2/5 md:top-0 md:left-1/4 -translate-x-1/2">
                <div className="w-full h-32 bg-primary/15 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }} />
              </div>

              <div className="absolute w-4/5 top-[24%] -right-[15%] md:w-1/2 md:top-0 md:-right-[5%]">
                <div className="w-full h-40 bg-primary/10 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>

              {/* TV/Video placeholder */}
              <div className="absolute w-3/5 -left-[15%] md:left-[10%] top-[80%] md:w-2/5 md:left-[15%] md:top-[75%]">
                <div className="relative">
                  {/* TV frame skeleton */}
                  <div className="w-full aspect-video bg-primary/20 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }}>
                    {/* Loading spinner for video */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute w-3/5 right-0 md:right-[-5%] top-[75%] md:w-2/5 md:right-[5%] md:top-[70%]">
                <div className="w-full h-32 bg-primary/15 rounded-lg animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>

            {/* Text content skeleton - matching the Arabic paragraph */}
            <div className="mt-[16vw] pt-[20%] md:pt-0">
              <div className="w-full px-3 space-y-3" dir="rtl">
                <div className="h-4 bg-secondary/40 rounded w-full animate-pulse" />
                <div className="h-4 bg-secondary/40 rounded w-[95%] animate-pulse" style={{ animationDelay: '0.1s' }} />
                <div className="h-4 bg-secondary/40 rounded w-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="h-4 bg-secondary/40 rounded w-[90%] animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="h-4 bg-secondary/40 rounded w-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="h-4 bg-secondary/40 rounded w-[85%] animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {/* Two cards skeleton - اقرأ and شاهد */}
            <div className="w-full flex flex-col-reverse lg:flex-row lg:gap-10 text-right mt-12">
              {/* First card (اقرأ - Read) */}
              <div className="flex w-[100%] items-center shadow-2xl rounded-2xl py-4 lg:w-[50%] mt-6 lg:mt-0 pr-4 bg-primary/10 animate-pulse">
                <div className="ml-auto space-y-2">
                  <div className="h-6 bg-secondary/30 rounded w-20" />
                  <div className="h-4 bg-secondary/20 rounded w-32" />
                </div>
                <div className="w-[70px] h-[70px] bg-secondary/30 rounded-full ml-5 animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>

              {/* Second card (شاهد - Watch) with eye animation */}
              <div className="flex w-[100%] items-center py-3 pr-4 rounded-2xl lg:w-[50%] relative overflow-hidden bg-[rgba(0,0,0,0.3)]">
                <div className="ml-auto space-y-2 relative z-10">
                  <div className="h-6 bg-white/40 rounded w-20" />
                  <div className="h-4 bg-white/30 rounded w-32" />
                </div>
                <div className="relative w-fit ml-5 z-10">
                  {/* Eye skeleton with animated pupil */}
                  <div className="w-[70px] h-[70px] bg-white/30 rounded-full animate-pulse relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Central loading indicator */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="text-center bg-primary/90 px-8 py-6 rounded-2xl shadow-2xl">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-secondary/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-secondary text-xl font-emirates">جاري التحميل...</p>
        </div>
      </div>

      {/* About Section Skeleton */}
      <div className="w-full py-16 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 h-96 bg-primary/10 rounded-lg animate-pulse" />
            <div className="w-full md:w-1/2 space-y-4" dir="rtl">
              <div className="h-8 bg-primary/20 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-secondary/30 rounded w-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="h-4 bg-secondary/30 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="h-4 bg-secondary/30 rounded w-4/5 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="h-4 bg-secondary/30 rounded w-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* History Section Skeleton */}
      <div className="w-full py-16 px-4 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-primary/20 rounded w-1/3 mx-auto mb-12 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-48 bg-primary/10 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                <div className="h-6 bg-primary/15 rounded w-3/4 animate-pulse" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
                <div className="h-4 bg-secondary/30 rounded w-full animate-pulse" style={{ animationDelay: `${i * 0.1 + 0.2}s` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
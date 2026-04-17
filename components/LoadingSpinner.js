export default function LoadingSpinner() {
  return (
    <div
      id='loading-spinner'
      className='py-20'
      role='status'
      aria-label='Loading movies'
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className='bg-surface rounded-2xl overflow-hidden border border-border/30 fade-in-up'
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Poster skeleton */}
            <div className='aspect-2/3 shimmer' />
            {/* Info skeleton */}
            <div className='p-4 space-y-3'>
              <div className='h-5 w-3/4 rounded-lg shimmer' />
              <div className='flex justify-between'>
                <div className='h-4 w-12 rounded-lg shimmer' />
                <div className='h-4 w-16 rounded-lg shimmer' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screen reader text */}
      <span className='sr-only'>Loading movies...</span>
    </div>
  );
}

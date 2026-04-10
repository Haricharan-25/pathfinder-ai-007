const SkeletonCard = () => (
  <div className="rounded-xl border border-border p-5 space-y-3">
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full skeleton-shimmer shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        <div className="h-3 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-5/6 rounded skeleton-shimmer" />
      </div>
      <div className="h-6 w-12 rounded skeleton-shimmer shrink-0" />
    </div>
    <div className="flex gap-2">
      <div className="h-5 w-16 rounded-full skeleton-shimmer" />
      <div className="h-5 w-20 rounded-full skeleton-shimmer" />
      <div className="h-5 w-14 rounded-full skeleton-shimmer" />
    </div>
  </div>
);

const SkeletonRoadmap = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    {/* Analysis cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-xl border border-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg skeleton-shimmer" />
            <div className="h-4 w-32 rounded skeleton-shimmer" />
          </div>
          <div className="h-3 w-full rounded skeleton-shimmer" />
          <div className="h-3 w-4/5 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
    {/* Steps skeleton */}
    <div className="space-y-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default SkeletonRoadmap;

export default function Loading() {
  return (
    <div className="lg:mt-30 relative z-10 mb-8 mt-10 px-2">
      <div className="mx-auto mb-8 mt-4 max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="relative aspect-square animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
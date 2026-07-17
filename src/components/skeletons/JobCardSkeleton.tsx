export function JobCardSkeleton() {
  return (
    <div className="flex flex-col bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
        <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-16"></div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-20"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div>
      </div>
      <div className="space-y-2 mb-6 flex-1">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5"></div>
      </div>
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div>
      </div>
    </div>
  );
}

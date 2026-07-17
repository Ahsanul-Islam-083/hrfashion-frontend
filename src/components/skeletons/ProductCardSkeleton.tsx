export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 w-full"></div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5"></div>
        </div>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-8"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

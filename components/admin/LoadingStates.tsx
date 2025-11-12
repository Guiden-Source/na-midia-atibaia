// Loading skeletons para páginas admin

export function DashboardSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Recent Orders Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductsTableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Search and Filters Skeleton */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
          <div key={row} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrdersListSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image upload skeleton */}
          <div className="md:col-span-2">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>

          {/* Form fields skeleton */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={i === 6 ? 'md:col-span-2' : ''}>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}

          {/* Submit button skeleton */}
          <div className="md:col-span-2">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

export default function DeliveryLoading() {
    return (
        <div className="container mx-auto px-4 md:px-0 py-8 space-y-8 animate-pulse">
            {/* Search Skeleton */}
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-full max-w-2xl mx-auto" />

            {/* Categories Skeleton */}
            <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
                ))}
            </div>

            {/* Highlights Skeleton */}
            <div className="space-y-4">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[280px] h-40 rounded-2xl bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
                    ))}
                </div>
            </div>

            {/* Product List Skeleton */}
            <div className="space-y-4">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex-1 space-y-3">
                                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                            <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-baloo2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Back to site */}
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Home size={16} />
          <span className="hidden sm:inline">Ver Site</span>
        </Link>
      </div>
    </div>
  );
}

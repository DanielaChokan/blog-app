"use client";

import { usePostFilters } from "@/hooks/usePostFilters";

export default function PostFilters() {
    const { filter, updateFilter } = usePostFilters();

    return (
        <div className="mb-4">
            <input
                value={filter}
                onChange={(e) => updateFilter(e.target.value)}
                placeholder="Search by title or author"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-inherit shadow-sm placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
        </div>
    );
}

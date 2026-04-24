"use client";

import { useMemo, useState } from "react";
import { usePosts } from "@/hooks/usePosts";

export function usePostFilters() {
    const { posts } = usePosts();
    const [filter, setFilter] = useState("");

    const filteredPosts = useMemo(() => {
        const normalized = filter.trim().toLowerCase();
        if (!normalized) return posts;

        return posts.filter(
            (post) =>
                post.title.toLowerCase().includes(normalized) ||
                post.author.toLowerCase().includes(normalized),
        );
    }, [posts, filter]);

    return { filter, filteredPosts, updateFilter: setFilter };
}

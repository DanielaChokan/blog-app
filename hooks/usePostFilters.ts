"use client";

import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/store/slices/postsSlice";

export function usePostFilters() {
	const dispatch = useAppDispatch();
	const { posts, filter } = useAppSelector((s) => s.posts);

	const filteredPosts = useMemo(() => {
		const normalized = filter.trim().toLowerCase();
		if (!normalized) return posts;

		return posts.filter(
			(post) =>
				post.title.toLowerCase().includes(normalized) ||
				post.author.toLowerCase().includes(normalized),
		);
	}, [posts, filter]);

	function updateFilter(value: string) {
		dispatch(setFilter(value));
	}

	return {
		filter,
		filteredPosts,
		updateFilter,
	};
}

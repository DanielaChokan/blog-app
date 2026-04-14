"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { deletePostThunk, updatePostThunk } from "@/store/slices/postsSlice";
import { UpdatePostDto } from "@/types/blog";

export function usePostActions() {
	const dispatch = useAppDispatch();
	const [pendingId, setPendingId] = useState<string | null>(null);

	async function removePost(id: string, expectedVersion: number) {
		try {
			setPendingId(id);
			await dispatch(deletePostThunk({ id, expectedVersion })).unwrap();
		} finally {
			setPendingId(null);
		}
	}

	async function updatePost(id: string, data: UpdatePostDto) {
		return dispatch(updatePostThunk({ id, data })).unwrap();
	}

	return { removePost, updatePost, pendingId };
}

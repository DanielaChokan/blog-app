"use client";

import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { UpdatePostDto } from "@/types/blog";

export function usePostActions() {
    const { deletePost, updatePost } = usePosts();
    const [pendingId, setPendingId] = useState<string | null>(null);

    async function removePost(id: string, expectedVersion: number) {
        try {
            setPendingId(id);
            await deletePost(id, expectedVersion);
        } finally {
            setPendingId(null);
        }
    }

    async function updatePostById(id: string, data: UpdatePostDto) {
        return updatePost(id, data);
    }

    return { removePost, updatePost: updatePostById, pendingId };
}

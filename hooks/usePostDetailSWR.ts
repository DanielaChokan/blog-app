"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import {
    PostWithComments,
    UpdatePostDto,
    CreateCommentDto,
} from "@/types/blog";

const fetcher = (url: string) => {
    const id = url.split("/").pop()!;
    return apiClient.getPostById(id);
};

export function usePostDetailSWR(id: string, fallbackData?: PostWithComments) {
    const key = `/api/posts/${id}`;
    const {
        data: post,
        isLoading,
        error,
        mutate,
    } = useSWR<PostWithComments>(key, fetcher, {
        fallbackData,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    async function updatePost(data: UpdatePostDto): Promise<void> {
        if (!post) return;
        const updated = await apiClient.updatePost(id, data);
        await mutate({ ...post, ...updated }, { revalidate: false });
    }

    async function addComment(data: CreateCommentDto): Promise<void> {
        const comment = await apiClient.addComment(id, data);
        if (!post) return;
        await mutate(
            { ...post, comments: [...(post.comments ?? []), comment] },
            { revalidate: false },
        );
    }

    return { post, isLoading, error, mutate, updatePost, addComment };
}

"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { ApiClientError, apiClient } from "@/lib/api-client";
import { Post, CreatePostDto, UpdatePostDto } from "@/types/blog";

const POSTS_KEY = "/api/posts";

const fetcher = () => apiClient.getPosts();

export function usePosts() {
    const { data: posts = [], isLoading, error, mutate } = useSWR<Post[]>(POSTS_KEY, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
    });

    async function createPost(data: CreatePostDto): Promise<Post> {
        const newPost = await apiClient.createPost(data);
        await mutate([newPost, ...posts], { revalidate: false });
        return newPost;
    }

    async function deletePost(id: string, expectedVersion: number): Promise<void> {
        await mutate(posts.filter((p) => p.id !== id), { revalidate: false });
        try {
            await apiClient.deletePost(id, expectedVersion);
            await mutate();
        } catch (err) {
            if (err instanceof ApiClientError && (err.status === 404 || err.status === 409)) {
                await mutate();
                return;
            }
            await mutate(posts, { revalidate: false });
            throw err;
        }
    }

    async function updatePost(id: string, data: UpdatePostDto): Promise<Post> {
        const updated = await apiClient.updatePost(id, data);
        await mutate(
            posts.map((p) => (p.id === id ? updated : p)),
            { revalidate: false },
        );
        return updated;
    }

    return { posts, isLoading, error, createPost, deletePost, updatePost };
}

export function invalidatePosts() {
    return globalMutate(POSTS_KEY);
}
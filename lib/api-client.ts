import {
    Comment,
    CreateCommentDto,
    CreatePostDto,
    Post,
    PostWithComments,
    UpdatePostDto,
} from "@/types/blog";
import { clientAuth } from "@/lib/firebase-client";

async function safeJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res
            .json()
            .catch(() => ({ message: "Request failed" }));
        throw new Error(err.message || "Request failed");
    }
    return res.json() as Promise<T>;
}

async function authHeaders(): Promise<Record<string, string>> {
    const token = await clientAuth.currentUser?.getIdToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
}

export const apiClient = {
    async getPosts() {
        const res = await fetch("/api/posts", { method: "GET" });
        return safeJson<Post[]>(res);
    },

    async createPost(data: CreatePostDto) {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(await authHeaders()),
            },
            body: JSON.stringify(data),
        });
        return safeJson<Post>(res);
    },

    async getPostById(id: string) {
        const res = await fetch(`/api/posts/${id}`, { method: "GET" });
        return safeJson<PostWithComments>(res);
    },

    async updatePost(id: string, data: UpdatePostDto) {
        const res = await fetch(`/api/posts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(await authHeaders()),
            },
            body: JSON.stringify(data),
        });
        return safeJson<Post>(res);
    },

    async deletePost(id: string) {
        const res = await fetch(`/api/posts/${id}`, {
            method: "DELETE",
            headers: { ...(await authHeaders()) },
        });
        return safeJson<{ ok: boolean }>(res);
    },

    async addComment(postId: string, data: CreateCommentDto) {
        const res = await fetch(`/api/posts/${postId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return safeJson<Comment>(res);
    },
};

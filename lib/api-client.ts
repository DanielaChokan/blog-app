import {
    Comment,
    CreateCommentDto,
    CreatePostDto,
    Post,
    PostWithComments,
    UpdatePostDto,
} from "@/types/blog";
import { ApiErrorBody, ApiErrorCode } from "@/types/api-error";
import { clientAuth } from "@/lib/firebase-client";

export class ApiClientError extends Error {
    status: number;
    code?: ApiErrorCode;
    details?: unknown;

    constructor(status: number, message: string, code?: ApiErrorCode, details?: unknown) {
        super(message);
        this.name = "ApiClientError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

const STATUS_FALLBACK_MESSAGE: Record<number, string> = {
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict",
    422: "Validation failed",
    500: "Internal server error",
};

async function safeJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const payload = (await res
            .json()
            .catch(() => ({}))) as Partial<ApiErrorBody>;

        const message =
            payload.message ||
            STATUS_FALLBACK_MESSAGE[res.status] ||
            `Request failed with status ${res.status}`;

        throw new ApiClientError(res.status, message, payload.code, payload.details);
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

    async deletePost(id: string, expectedVersion: number) {
        const res = await fetch(`/api/posts/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(await authHeaders()),
            },
            body: JSON.stringify({ expectedVersion }),
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

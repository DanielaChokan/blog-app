import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SWRConfig } from "swr";
import { usePosts } from "@/hooks/usePosts";
import { CreatePostDto, Post } from "@/types/blog";
import type { ReactNode } from "react";
import { ApiClientError } from "@/lib/api-client";

const mocks = vi.hoisted(() => ({
    getPosts: vi.fn(),
    createPost: vi.fn(),
    deletePost: vi.fn(),
    updatePost: vi.fn(),
}));

vi.mock("@/lib/api-client", () => {
    class ApiClientError extends Error {
        status: number;

        constructor(status: number, message: string) {
            super(message);
            this.name = "ApiClientError";
            this.status = status;
        }
    }

    return {
        ApiClientError,
        apiClient: {
            getPosts: mocks.getPosts,
            createPost: mocks.createPost,
            deletePost: mocks.deletePost,
            updatePost: mocks.updatePost,
        },
    };
});

function swrWrapper({ children }: { children: ReactNode }) {
    return (
        <SWRConfig
            value={{
                provider: () => new Map(),
                dedupingInterval: 0,
                errorRetryCount: 0,
            }}
        >
            {children}
        </SWRConfig>
    );
}

function makePost(id: string, version = 1): Post {
    return {
        id,
        title: `Title ${id}`,
        content: `Content ${id}`,
        author: "Author",
        tags: [],
        ownerId: "owner-1",
        version,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
    };
}

describe("usePosts (SWR)", () => {
    it("creates post and prepends it in cache without waiting for refetch", async () => {
        const existing = makePost("1");
        const created = makePost("2");
        const payload: CreatePostDto = {
            title: "New post",
            content: "Body",
            author: "Author",
            tags: ["tag1"],
        };

        mocks.getPosts.mockResolvedValueOnce([existing]);
        mocks.createPost.mockResolvedValueOnce(created);

        const { result } = renderHook(() => usePosts(), { wrapper: swrWrapper });

        await waitFor(() => {
            expect(result.current.posts).toHaveLength(1);
        });

        await act(async () => {
            await result.current.createPost(payload);
        });

        await waitFor(() => {
            expect(result.current.posts.map((p) => p.id)).toEqual(["2", "1"]);
        });
    });

    it("rolls back optimistic delete on unexpected error", async () => {
        const first = makePost("1");
        const second = makePost("2");

        mocks.getPosts.mockResolvedValueOnce([first, second]);
        mocks.deletePost.mockRejectedValueOnce(new Error("Network failure"));

        const { result } = renderHook(() => usePosts(), { wrapper: swrWrapper });

        await waitFor(() => {
            expect(result.current.posts).toHaveLength(2);
        });

        await expect(
            act(async () => {
                await result.current.deletePost("1", 1);
            }),
        ).rejects.toThrow("Network failure");

        await waitFor(() => {
            expect(result.current.posts.map((p) => p.id)).toEqual(["1", "2"]);
        });
    });

    it("revalidates after 409 conflict and does not throw", async () => {
        const first = makePost("1", 1);
        const second = makePost("2", 1);

        mocks.getPosts
            .mockResolvedValueOnce([first, second])
            .mockResolvedValueOnce([second]);

        mocks.deletePost.mockRejectedValueOnce(
            new ApiClientError(409, "Post was changed in another session"),
        );

        const { result } = renderHook(() => usePosts(), { wrapper: swrWrapper });

        await waitFor(() => {
            expect(result.current.posts).toHaveLength(2);
        });

        await act(async () => {
            await result.current.deletePost("1", 1);
        });

        await waitFor(() => {
            expect(result.current.posts.map((p) => p.id)).toEqual(["2"]);
        });
    });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireUser: vi.fn(),
    runTransaction: vi.fn(),
    doc: vi.fn(),
}));

vi.mock("@/lib/server-auth", () => ({
    requireUser: mocks.requireUser,
}));

vi.mock("@/lib/firebase-admin", () => ({
    postsCollection: {
        doc: mocks.doc,
        firestore: {
            runTransaction: mocks.runTransaction,
        },
    },
    commentsCollection: {},
}));

import { DELETE, PATCH } from "@/app/api/posts/[id]/route";

function makeRequest(method: "PATCH" | "DELETE", body: unknown) {
    return new Request("http://localhost/api/posts/post-1", {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

describe("posts/[id] security", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 for PATCH when user is unauthorized", async () => {
        mocks.requireUser.mockRejectedValueOnce(new Error("UNAUTHORIZED"));

        const res = await PATCH(
            makeRequest("PATCH", { title: "Valid title", expectedVersion: 1 }) as never,
            { params: Promise.resolve({ id: "post-1" }) },
        );

        expect(res.status).toBe(401);
        await expect(res.json()).resolves.toMatchObject({
            code: "UNAUTHORIZED",
        });
    });

    it("returns 404 for DELETE when post is already soft-deleted", async () => {
        mocks.requireUser.mockResolvedValueOnce({ uid: "owner-1" });

        const postRef = { id: "post-1" };
        const tx = {
            get: vi.fn().mockResolvedValue({
                exists: true,
                data: () => ({ ownerId: "owner-1", version: 1, isDeleted: true }),
            }),
            update: vi.fn(),
        };

        mocks.doc.mockReturnValue(postRef);
        mocks.runTransaction.mockImplementationOnce(async (cb: (txArg: unknown) => unknown) =>
            cb(tx),
        );

        const res = await DELETE(
            makeRequest("DELETE", { expectedVersion: 1 }) as never,
            { params: Promise.resolve({ id: "post-1" }) },
        );

        expect(res.status).toBe(404);
        await expect(res.json()).resolves.toMatchObject({ code: "NOT_FOUND" });
        expect(tx.update).not.toHaveBeenCalled();
    });

    it("returns 403 for DELETE when trying to remove чужий post", async () => {
        mocks.requireUser.mockResolvedValueOnce({ uid: "owner-1" });

        const postRef = { id: "post-1" };
        const tx = {
            get: vi.fn().mockResolvedValue({
                exists: true,
                data: () => ({ ownerId: "owner-2", version: 1 }),
            }),
            delete: vi.fn(),
        };

        mocks.doc.mockReturnValue(postRef);
        mocks.runTransaction.mockImplementationOnce(async (cb: (txArg: unknown) => unknown) =>
            cb(tx),
        );

        const res = await DELETE(
            makeRequest("DELETE", { expectedVersion: 1 }) as never,
            { params: Promise.resolve({ id: "post-1" }) },
        );

        expect(res.status).toBe(403);
        await expect(res.json()).resolves.toMatchObject({
            code: "FORBIDDEN",
        });
        expect(tx.delete).not.toHaveBeenCalled();
    });
});

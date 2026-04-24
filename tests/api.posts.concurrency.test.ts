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

import { PATCH } from "@/app/api/posts/[id]/route";

describe("posts/[id] concurrency", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 409 when PATCH expectedVersion is stale", async () => {
        mocks.requireUser.mockResolvedValueOnce({ uid: "owner-1" });

        const postRef = { id: "post-1", get: vi.fn() };
        const tx = {
            get: vi.fn().mockResolvedValue({
                exists: true,
                data: () => ({ ownerId: "owner-1", version: 3 }),
            }),
            update: vi.fn(),
        };

        mocks.doc.mockReturnValue(postRef);
        mocks.runTransaction.mockImplementationOnce(async (cb: (txArg: unknown) => unknown) =>
            cb(tx),
        );

        const req = new Request("http://localhost/api/posts/post-1", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Updated title",
                expectedVersion: 1,
            }),
        });

        const res = await PATCH(req as never, { params: Promise.resolve({ id: "post-1" }) });

        expect(res.status).toBe(409);
        await expect(res.json()).resolves.toMatchObject({
            code: "CONFLICT",
            details: { currentVersion: 3 },
        });
        expect(tx.update).not.toHaveBeenCalled();
    });
});

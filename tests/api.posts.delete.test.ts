import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    where: vi.fn(),
    limit: vi.fn(),
    get: vi.fn(),
    batch: vi.fn(),
    batchDelete: vi.fn(),
    batchCommit: vi.fn(),
}));

vi.mock("@/lib/firebase-admin", () => ({
    commentsCollection: {
        where: mocks.where,
        firestore: {
            batch: mocks.batch,
        },
    },
    postsCollection: {},
}));

import { deleteCommentsByPostId } from "@/lib/firestore-utils";

function makeDocs(count: number) {
    return Array.from({ length: count }, (_, index) => ({
        ref: { id: `comment-${index}` },
    }));
}

describe("deleteCommentsByPostId", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.where.mockReturnValue({ limit: mocks.limit });
        mocks.limit.mockReturnValue({ get: mocks.get });
        mocks.batch.mockReturnValue({
            delete: mocks.batchDelete,
            commit: mocks.batchCommit,
        });
        mocks.batchCommit.mockResolvedValue(undefined);
    });

    it("deletes comments in chunks when there are more than 500 comments", async () => {
        const docs200a = makeDocs(200);
        const docs200b = makeDocs(200);
        const docs150 = makeDocs(150);

        mocks.get
            .mockResolvedValueOnce({ empty: false, size: 200, docs: docs200a })
            .mockResolvedValueOnce({ empty: false, size: 200, docs: docs200b })
            .mockResolvedValueOnce({ empty: false, size: 150, docs: docs150 });

        const deleted = await deleteCommentsByPostId("post-1");

        expect(deleted).toBe(550);
        expect(mocks.where).toHaveBeenCalledWith("postId", "==", "post-1");
        expect(mocks.limit).toHaveBeenCalledWith(200);
        expect(mocks.batchCommit).toHaveBeenCalledTimes(3);
        expect(mocks.batchDelete).toHaveBeenCalledTimes(550);
        expect(mocks.get).toHaveBeenCalledTimes(3);
    });
});

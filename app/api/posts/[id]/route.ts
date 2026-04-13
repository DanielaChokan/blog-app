import { NextRequest, NextResponse } from "next/server";
import { commentsCollection, postsCollection } from "@/lib/firebase-admin";
import { deletePostSchema, updatePostSchema } from "@/lib/zod-schemas";
import { flattenError } from "zod";
import { requireUser } from "@/lib/server-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const postDoc = await postsCollection.doc(id).get();

        if (!postDoc.exists) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 },
            );
        }

        const commentsSnap = await commentsCollection
            .where("postId", "==", id)
            .get();

        const comments = commentsSnap.docs
            .map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            .sort((a, b) => {
                const aCreatedAt = String(
                    (a as { createdAt?: string }).createdAt ?? "",
                );
                const bCreatedAt = String(
                    (b as { createdAt?: string }).createdAt ?? "",
                );
                return aCreatedAt.localeCompare(bCreatedAt);
            });

        const postData = postDoc.data() as { version?: number };
        return NextResponse.json(
            {
                id: postDoc.id,
                ...postData,
                version: postData.version ?? 1,
                comments,
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch post", error: String(error) },
            { status: 500 },
        );
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const user = await requireUser(req);
        const { id } = await params;
        const postRef = postsCollection.doc(id);
        const body = await req.json();
        const parsed = updatePostSchema.safeParse(body);

        if (!parsed.success) {
            const errors = flattenError(parsed.error);
            return NextResponse.json(
                { message: "Validation failed", errors },
                { status: 400 },
            );
        }

        const result = await postsCollection.firestore.runTransaction(async (tx) => {
            const snap = await tx.get(postRef);
            if (!snap.exists) {
                return { type: "NOT_FOUND" as const };
            }

            const current = snap.data() as { ownerId?: string; version?: number };
            const currentVersion = current.version ?? 1;

            if (current.ownerId !== user.uid) {
                return { type: "FORBIDDEN" as const };
            }

            if (currentVersion !== parsed.data.expectedVersion) {
                return {
                    type: "CONFLICT" as const,
                    currentVersion,
                };
            }

            const now = new Date().toISOString();
            const { expectedVersion, ...nextData } = parsed.data;
            void expectedVersion;

            tx.update(postRef, {
                ...nextData,
                updatedAt: now,
                version: currentVersion + 1,
            });

            return { type: "OK" as const };
        });

        if (result.type === "NOT_FOUND") {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        if (result.type === "FORBIDDEN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        if (result.type === "CONFLICT") {
            return NextResponse.json(
                {
                    message: "Post was changed in another session",
                    currentVersion: result.currentVersion,
                },
                { status: 409 },
            );
        }

        const updated = await postRef.get();
        const updatedData = updated.data() as { version?: number };
        return NextResponse.json(
            { id: updated.id, ...updatedData, version: updatedData.version ?? 1 },
            { status: 200 },
        );
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }
        return NextResponse.json(
            { message: "Failed to update post", error: String(error) },
            { status: 500 },
        );
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const user = await requireUser(req);
        const { id } = await params;
        const postRef = postsCollection.doc(id);

        const body = await req.json().catch(() => null);
        const parsed = deletePostSchema.safeParse(body);

        if (!parsed.success) {
            const errors = flattenError(parsed.error);
            return NextResponse.json(
                { message: "Validation failed", errors },
                { status: 400 },
            );
        }

        const result = await postsCollection.firestore.runTransaction(async (tx) => {
            const snap = await tx.get(postRef);
            if (!snap.exists) {
                return { type: "NOT_FOUND" as const };
            }

            const current = snap.data() as { ownerId?: string; version?: number };
            const currentVersion = current.version ?? 1;

            if (current.ownerId !== user.uid) {
                return { type: "FORBIDDEN" as const };
            }

            if (currentVersion !== parsed.data.expectedVersion) {
                return {
                    type: "CONFLICT" as const,
                    currentVersion,
                };
            }

            tx.delete(postRef);
            return { type: "OK" as const };
        });

        if (result.type === "NOT_FOUND") {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        if (result.type === "FORBIDDEN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        if (result.type === "CONFLICT") {
            return NextResponse.json(
                {
                    message: "Post was changed in another session",
                    currentVersion: result.currentVersion,
                },
                { status: 409 },
            );
        }

        const commentsSnap = await commentsCollection
            .where("postId", "==", id)
            .get();
        const batch = commentsCollection.firestore.batch();

        commentsSnap.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }
        return NextResponse.json(
            { message: "Failed to delete post", error: String(error) },
            { status: 500 },
        );
    }
}

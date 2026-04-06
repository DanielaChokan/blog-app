import { NextRequest, NextResponse } from "next/server";
import { commentsCollection, postsCollection } from "@/lib/firebase-admin";
import { updatePostSchema } from "@/lib/zod-schemas";
import { flattenError } from "zod";

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

        return NextResponse.json(
            { id: postDoc.id, ...postDoc.data(), comments },
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
        const { id } = await params;
        const postRef = postsCollection.doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 },
            );
        }

        const body = await req.json();
        const parsed = updatePostSchema.safeParse(body);

        if (!parsed.success) {
            const errors = flattenError(parsed.error);
            return NextResponse.json(
                { message: "Validation failed", errors },
                { status: 400 },
            );
        }

        await postRef.update({
            ...parsed.data,
            updatedAt: new Date().toISOString(),
        });

        const updated = await postRef.get();
        return NextResponse.json(
            { id: updated.id, ...updated.data() },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update post", error: String(error) },
            { status: 500 },
        );
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const postRef = postsCollection.doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 },
            );
        }

        const commentsSnap = await commentsCollection
            .where("postId", "==", id)
            .get();
        const batch = postsCollection.firestore.batch();

        commentsSnap.docs.forEach((doc) => batch.delete(doc.ref));
        batch.delete(postRef);
        await batch.commit();

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to delete post", error: String(error) },
            { status: 500 },
        );
    }
}

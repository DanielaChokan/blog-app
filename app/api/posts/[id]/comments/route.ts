import { NextRequest, NextResponse } from "next/server";
import { commentsCollection, postsCollection } from "@/lib/firebase-admin";
import { createCommentSchema } from "@/lib/zod-schemas";
import { flattenError } from "zod";
import { fromUnknownError, notFound, validationError } from "@/lib/api-errors";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
	try {
		const { id: postId } = await params;

		const body = await req.json();
		const parsed = createCommentSchema.safeParse(body);

		if (!parsed.success) {
			return validationError("Validation failed", flattenError(parsed.error));
		}

		const payload = {
			...parsed.data,
			postId,
			createdAt: new Date().toISOString(),
		};

		const commentRef = commentsCollection.doc();
        
        const result = await commentsCollection.firestore.runTransaction(async (tx) => {
            const postSnap = await tx.get(postsCollection.doc(postId));

            if (!postSnap.exists) {
                return { type: "NOT_FOUND" as const };
            }

			const postData = postSnap.data() as { deletedAt?: FirebaseFirestore.Timestamp; isDeleted?: boolean };
			if (postData.isDeleted) {
                return { type: "NOT_FOUND" as const };
            }

            tx.set(commentRef, payload);
            return { type: "OK" as const };
        });

        if (result.type === "NOT_FOUND") {
            return notFound("Post not found");
        }

		return NextResponse.json({ id: commentRef.id, ...payload }, { status: 201 });
	} catch (error) {
		return fromUnknownError(error, "Failed to add comment");
	}
}
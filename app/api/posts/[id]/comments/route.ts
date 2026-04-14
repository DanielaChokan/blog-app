import { NextRequest, NextResponse } from "next/server";
import { commentsCollection, postsCollection } from "@/lib/firebase-admin";
import { createCommentSchema } from "@/lib/zod-schemas";
import { flattenError } from "zod";
import { fromUnknownError, notFound, validationError } from "@/lib/api-errors";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
	try {
		const { id: postId } = await params;
		const postDoc = await postsCollection.doc(postId).get();

		if (!postDoc.exists) {
			return notFound("Post not found");
		}

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

		const doc = await commentsCollection.add(payload);
		return NextResponse.json({ id: doc.id, ...payload }, { status: 201 });
	} catch (error) {
		return fromUnknownError(error, "Failed to add comment");
	}
}
import { NextRequest, NextResponse } from "next/server";
import { commentsCollection, postsCollection } from "@/lib/firebase-admin";
import { createCommentSchema } from "@/lib/zod-schemas";
import { flattenError } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
	try {
		const { id: postId } = await params;
		const postDoc = await postsCollection.doc(postId).get();

		if (!postDoc.exists) {
			return NextResponse.json({ message: "Post not found" }, { status: 404 });
		}

		const body = await req.json();
		const parsed = createCommentSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ message: "Validation failed", errors: flattenError(parsed.error) },
				{ status: 400 }
			);
		}

		const payload = {
			...parsed.data,
			postId,
			createdAt: new Date().toISOString(),
		};

		const doc = await commentsCollection.add(payload);
		return NextResponse.json({ id: doc.id, ...payload }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to add comment", error: String(error) },
			{ status: 500 }
		);
	}
}
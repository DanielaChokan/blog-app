import { NextRequest, NextResponse } from "next/server";
import { createPostSchema } from "@/lib/zod-schemas";
import { postsCollection } from "@/lib/firebase-admin";
import { flattenError } from "zod";

export async function GET() {
	try {
		const snap = await postsCollection.orderBy("createdAt", "desc").get();
		const posts = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		return NextResponse.json(posts, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to fetch posts", error: String(error) },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = createPostSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ message: "Validation failed", errors: flattenError(parsed.error) },
				{ status: 400 }
			);
		}

		const now = new Date().toISOString();
		const payload = {
			...parsed.data,
			createdAt: now,
			updatedAt: now,
		};

		const docRef = await postsCollection.add(payload);
		return NextResponse.json({ id: docRef.id, ...payload }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to create post", error: String(error) },
			{ status: 500 }
		);
	}
}
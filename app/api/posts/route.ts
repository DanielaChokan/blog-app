import { NextRequest, NextResponse } from "next/server";
import { createPostSchema } from "@/lib/zod-schemas";
import { postsCollection } from "@/lib/firebase-admin";
import { flattenError } from "zod";
import { requireUser } from "@/lib/server-auth";
import { fromUnknownError, validationError } from "@/lib/api-errors";

export async function GET() {
    try {
        const snap = await postsCollection.orderBy("createdAt", "desc").get();
        const posts = snap.docs.map((doc) => {
            const data = doc.data() as { version?: number };
            return { id: doc.id, ...data, version: data.version ?? 1 };
        });
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return fromUnknownError(error, "Failed to fetch posts");
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireUser(req);
        const body = await req.json();
        const parsed = createPostSchema.safeParse(body);

        if (!parsed.success) {
            return validationError("Validation failed", flattenError(parsed.error));
        }

        const now = new Date().toISOString();
        const payload = {
            ...parsed.data,
            ownerId: user.uid,
            version: 1,
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await postsCollection.add(payload);
        return NextResponse.json(
            { id: docRef.id, ...payload },
            { status: 201 },
        );
    } catch (error) {
        return fromUnknownError(error, "Failed to create post");
    }
}

import { commentsCollection } from "@/lib/firebase-admin";

const DELETE_CHUNK_SIZE = 200;

export async function deleteCommentsByPostId(postId: string): Promise<number> {
    let deleted = 0;

    while (true) {
        const snap = await commentsCollection
            .where("postId", "==", postId)
            .limit(DELETE_CHUNK_SIZE)
            .get();

        if (snap.empty) {
            break;
        }

        const batch = commentsCollection.firestore.batch();
        snap.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();

        deleted += snap.size;

        if (snap.size < DELETE_CHUNK_SIZE) {
            break;
        }
    }

    return deleted;
}
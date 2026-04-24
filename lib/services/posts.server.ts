import { commentsCollection, postsCollection } from "@/lib/firebase-admin";
import { Comment, Post, PostWithComments } from "@/types/blog";

export async function getInitialPostsServer(): Promise<Post[]> {
	const snap = await postsCollection
		.where("isDeleted", "==", false)
		.orderBy("createdAt", "desc")
		.get();
	return snap.docs.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<Post, "id">),
		}));
}

export async function getPostWithCommentsServer(
	id: string,
): Promise<PostWithComments | null> {
	const postDoc = await postsCollection.doc(id).get();
	if (!postDoc.exists) return null;

	const postData = postDoc.data() as { deletedAt?: FirebaseFirestore.Timestamp; isDeleted?: boolean };
	if (postData.isDeleted) return null;

	const commentsSnap = await commentsCollection.where("postId", "==", id).get();
	const comments: Comment[] = commentsSnap.docs
		.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<Comment, "id">),
		}))
		.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

	return {
		id: postDoc.id,
		...(postDoc.data() as Omit<Post, "id">),
		comments,
	};
}

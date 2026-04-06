import { notFound } from "next/navigation";
import PostDetail from "@/components/PostDetail";
import { StoreProvider } from "@/store/provider";
import { commentsCollection, postsCollection } from "@/lib/firebase-admin";
import { Comment, Post, PostWithComments } from "@/types/blog";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPostWithComments(id: string): Promise<PostWithComments | null> {
	const postDoc = await postsCollection.doc(id).get();
	if (!postDoc.exists) return null;

	const commentsSnap = await commentsCollection
		.where("postId", "==", id)
		.get();

	const comments: Comment[] = commentsSnap.docs
		.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<Comment, "id">),
		}))
		.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

	const postData = postDoc.data() as Omit<Post, "id">;
	return { id: postDoc.id, ...postData, comments };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const post = await getPostWithComments(id);

	if (!post) notFound();

	return (
		<main className={styles.main}>
			<StoreProvider initialPosts={[]} initialSelectedPost={post}>
				<PostDetail id={id} />
			</StoreProvider>
		</main>
	);
}
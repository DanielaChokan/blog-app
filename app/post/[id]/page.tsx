import { notFound } from "next/navigation";
import PostDetail from "@/components/PostDetail";
import { getPostWithCommentsServer } from "@/lib/services/posts.server";
import styles from "./page.module.css";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const post = await getPostWithCommentsServer(id);

	if (!post) notFound();

	return (
		<div className={styles.main}>
			<PostDetail id={id} initialData={post} />
		</div>
	);
}


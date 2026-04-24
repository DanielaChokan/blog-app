import { notFound } from "next/navigation";
import PostDetail from "@/components/PostDetail";
import AuthPanel from "@/components/AuthPanel";
import { getPostWithCommentsServer } from "@/lib/services/posts.server";
import styles from "./page.module.css";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const post = await getPostWithCommentsServer(id);

	if (!post) notFound();

	return (
		<main className={styles.main}>
			<div className={styles.authBar}>
				<AuthPanel />
			</div>
			<PostDetail id={id} initialData={post} />
		</main>
	);
}

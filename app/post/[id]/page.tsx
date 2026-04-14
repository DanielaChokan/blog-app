import { notFound } from "next/navigation";
import PostDetail from "@/components/PostDetail";
import AuthPanel from "@/components/AuthPanel";
import { StoreProvider } from "@/store/provider";
import { getPostWithCommentsServer } from "@/lib/services/posts.server";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const post = await getPostWithCommentsServer(id);

	if (!post) notFound();

	return (
		<main className={styles.main}>
			<div className={styles.authBar}>
				<AuthPanel />
			</div>
			<StoreProvider initialPosts={[]} initialSelectedPost={post}>
				<PostDetail id={id} />
			</StoreProvider>
		</main>
	);
}
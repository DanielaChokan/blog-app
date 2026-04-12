export const dynamic = "force-dynamic";
export const revalidate = 0;

import PostFilters from "@/components/PostFilters";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import AuthPanel from "@/components/AuthPanel";
import { StoreProvider } from "@/store/provider";
import { postsCollection } from "@/lib/firebase-admin";
import { Post } from "@/types/blog";
import styles from "./page.module.css";

async function getInitialPosts(): Promise<Post[]> {
	try {
		const snap = await postsCollection.orderBy("createdAt", "desc").get();
		return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Post, "id">) }));
	} catch (error) {
		console.error("Failed to load initial posts from Firestore:", error);
		return [];
	}
}

export default async function HomePage() {
	const initialPosts = await getInitialPosts();

	return (
		<main className={styles.main}>
			<header className={styles.topBar}>
				<h1 className={styles.title}>My Blog</h1>
				<AuthPanel />
			</header>

			<StoreProvider initialPosts={initialPosts}>
				<div id="auth-form-slot" className={styles.authFormSlot} />
				<div className={styles.grid}>
					<section>
						<PostForm />
					</section>

					<section>
						<PostFilters />
						<PostList />
					</section>
				</div>
			</StoreProvider>
		</main>
	);
}
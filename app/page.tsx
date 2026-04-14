export const dynamic = "force-dynamic";
export const revalidate = 0;

import PostFilters from "@/components/PostFilters";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import AuthPanel from "@/components/AuthPanel";
import { StoreProvider } from "@/store/provider";
import { getInitialPostsServer } from "@/lib/services/posts.server";
import styles from "./page.module.css";

export default async function HomePage() {
	const initialPosts = await getInitialPostsServer();

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
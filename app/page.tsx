export const dynamic = "force-dynamic";
export const revalidate = 0;

import PostFilters from "@/components/PostFilters";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import AuthPanel from "@/components/AuthPanel";
import styles from "./page.module.css";

export default function HomePage() {
    return (
        <main className={styles.main}>
            <header className={styles.topBar}>
                <h1 className={styles.title}>My Blog</h1>
                <AuthPanel />
            </header>

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
        </main>
    );
}

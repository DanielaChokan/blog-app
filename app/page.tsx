export const dynamic = "force-dynamic";
export const revalidate = 0;

import PostFilters from "@/components/PostFilters";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import styles from "./page.module.css";

export default function HomePage() {
    return (
        <div className={styles.main}>
            <div className={styles.grid}>
                <section>
                    <PostForm />
                </section>

                <section>
                    <PostFilters />
                    <PostList />
                </section>
            </div>
        </div>
    );
}

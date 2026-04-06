import styles from "./page.module.css";

export default function PostPageLoading() {
	return (
		<main className={styles.main}>
			<p className={styles.loading}>Loading post details...</p>
		</main>
	);
}

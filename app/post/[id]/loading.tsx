import styles from "./page.module.css";

export default function PostPageLoading() {
	return (
		<div className={styles.main}>
			<p className={styles.loading}>Loading post details...</p>
		</div>
	);
}

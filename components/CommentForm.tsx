"use client";

import { useCommentForm } from "@/hooks/useCommentForm";
import styles from "./CommentForm.module.css";

export default function CommentForm({ postId }: { postId: string }) {
	const { register, onSubmit, errors, isSubmitting } = useCommentForm(postId);

	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<h4 className={styles.title}>Add comment</h4>
			<input
				{...register("author")}
				placeholder="Your name"
				className={styles.input}
			/>
			{errors.author?.message && (
				<p className={styles.error}>{errors.author.message}</p>
			)}
			<textarea
				{...register("text")}
				rows={3}
				placeholder="Comment text"
				className={styles.textarea}
			/>
			{errors.text?.message && (
				<p className={styles.error}>{errors.text.message}</p>
			)}
			{errors.root?.message && <p className={styles.error}>{errors.root.message}</p>}
			<button
				type="submit"
				disabled={isSubmitting}
				className={styles.submitButton}
			>
				{isSubmitting ? "Sending..." : "Send"}
			</button>
		</form>
	);
}
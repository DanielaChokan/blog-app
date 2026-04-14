"use client";

import { usePostForm } from "@/hooks/usePostForm";
import styles from "./PostForm.module.css";

export default function PostForm() {
	const { register, onSubmit, errors, isSubmitting, loading, user } = usePostForm();

	const disabled = isSubmitting || loading || !user;

	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<h2 className={styles.title}>Create Post</h2>

			<div className={styles.fieldBlock}>
				<input
					{...register("title")}
					placeholder="Title"
					className={styles.input}
				/>
				{errors.title?.message && (
					<p className={styles.error}>{errors.title.message}</p>
				)}
			</div>

			<div className={styles.fieldBlock}>
				<textarea
					{...register("content")}
					placeholder="Post content"
					rows={6}
					className={styles.textarea}
				/>
				{errors.content?.message && (
					<p className={styles.error}>{errors.content.message}</p>
				)}
			</div>

			<div className={`${styles.fieldBlock} ${styles.twoColumns}`}>
				<div>
					<input
						{...register("author")}
						placeholder="Author"
						className={styles.input}
					/>
					{errors.author?.message && (
						<p className={styles.error}>{errors.author.message}</p>
					)}
				</div>
				<div>
					<input
						{...register("tagsText")}
						placeholder="Tags separated by commas"
						className={styles.input}
					/>
					{errors.tagsText?.message && (
						<p className={styles.error}>{errors.tagsText.message}</p>
					)}
				</div>
			</div>

			<button
				disabled={disabled}
				type="submit"
				className={styles.submitButton}
			>
				{isSubmitting
					? "Creating..."
					: loading
					  ? "Checking auth..."
					  : user
						? "Create"
						: "Sign in to create"}
			</button>
			{errors.root?.message && <p className={styles.error}>{errors.root.message}</p>}
		</form>
	);
}
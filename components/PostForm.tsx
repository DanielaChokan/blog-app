"use client";

import { useMemo, useState, type SubmitEvent } from "react";
import { createPostSchema } from "@/lib/zod-schemas";
import { createPostThunk } from "@/store/slices/postsSlice";
import { useAppDispatch } from "@/store/hooks";
import { useAuthUser } from "@/lib/use-auth-user";
import { flattenError } from "zod";
import styles from "./PostForm.module.css";

type Errors = Partial<
	Record<"title" | "content" | "author" | "tags" | "form", string>
>;

export default function PostForm() {
	const dispatch = useAppDispatch();
	const { user, loading } = useAuthUser();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [author, setAuthor] = useState("");
	const [tagsText, setTagsText] = useState("");
	const [errors, setErrors] = useState<Errors>({});
	const [pending, setPending] = useState(false);

	const tags = useMemo(
		() => tagsText.split(",").map((x) => x.trim()).filter(Boolean),
		[tagsText]
	);

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!user) {
			setErrors({ form: "Please sign in to create a post." });
			return;
		}

		const payload = { title, content, author, tags };
		const parsed = createPostSchema.safeParse(payload);

		if (!parsed.success) {
			const f = flattenError(parsed.error).fieldErrors;
			setErrors({
				title: f.title?.[0],
				content: f.content?.[0],
				author: f.author?.[0],
				tags: f.tags?.[0],
				form: undefined,
			});
			return;
		}

		try {
			setPending(true);
			setErrors({});
			await dispatch(createPostThunk(parsed.data)).unwrap();
			setTitle("");
			setContent("");
			setAuthor("");
			setTagsText("");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			setErrors({ form: message });
		} finally {
			setPending(false);
		}
	}

	const disabled = pending || loading || !user;

	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<h2 className={styles.title}>Create Post</h2>

			<div className={styles.fieldBlock}>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
					className={styles.input}
				/>
				{errors.title && <p className={styles.error}>{errors.title}</p>}
			</div>

			<div className={styles.fieldBlock}>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Post content"
					rows={6}
					className={styles.textarea}
				/>
				{errors.content && <p className={styles.error}>{errors.content}</p>}
			</div>

			<div className={`${styles.fieldBlock} ${styles.twoColumns}`}>
				<div>
					<input
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						placeholder="Author"
						className={styles.input}
					/>
					{errors.author && <p className={styles.error}>{errors.author}</p>}
				</div>
				<div>
					<input
						value={tagsText}
						onChange={(e) => setTagsText(e.target.value)}
						placeholder="Tags separated by commas"
						className={styles.input}
					/>
					{errors.tags && <p className={styles.error}>{errors.tags}</p>}
				</div>
			</div>

			<button
				disabled={disabled}
				type="submit"
				className={styles.submitButton}
			>
				{pending
					? "Creating..."
					: loading
					  ? "Checking auth..."
					  : user
						? "Create"
						: "Sign in to create"}
			</button>
			{errors.form && <p className={styles.error}>{errors.form}</p>}
		</form>
	);
}
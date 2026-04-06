"use client";

import { useState, type SubmitEvent } from "react";
import { createCommentSchema } from "@/lib/zod-schemas";
import { addCommentThunk } from "@/store/slices/postsSlice";
import { useAppDispatch } from "@/store/hooks";
import styles from "./CommentForm.module.css";

export default function CommentForm({ postId }: { postId: string }) {
	const dispatch = useAppDispatch();
	const [author, setAuthor] = useState("");
	const [text, setText] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		const parsed = createCommentSchema.safeParse({ author, text });

		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Validation error");
			return;
		}

		try {
			setPending(true);
			setError(null);
			await dispatch(addCommentThunk({ postId, data: parsed.data })).unwrap();
			setAuthor("");
			setText("");
		} catch (submitError) {
			const message = submitError instanceof Error ? submitError.message : "Failed to send comment";
			setError(message);
		} finally {
			setPending(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<h4 className={styles.title}>Add comment</h4>
			<input
				value={author}
				onChange={(e) => setAuthor(e.target.value)}
				placeholder="Your name"
				className={styles.input}
			/>
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				rows={3}
				placeholder="Comment text"
				className={styles.textarea}
			/>
			{error && <p className={styles.error}>{error}</p>}
			<button
				type="submit"
				disabled={pending}
				className={styles.submitButton}
			>
				{pending ? "Sending..." : "Send"}
			</button>
		</form>
	);
}
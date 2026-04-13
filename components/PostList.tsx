"use client";

import { useState } from "react";
import Link from "next/link";
import { deletePostThunk } from "@/store/slices/postsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuthUser } from "@/lib/use-auth-user";
import styles from "./PostList.module.css";

export default function PostList() {
	const dispatch = useAppDispatch();
	const { user } = useAuthUser();
	const { posts, filter } = useAppSelector((s) => s.posts);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	async function onDelete(postId: string, expectedVersion: number) {
		if (!user) return;

		try {
			setDeletingId(postId);
			await dispatch(deletePostThunk({ id: postId, expectedVersion })).unwrap();
		} finally {
			setDeletingId(null);
		}
	}

	const normalized = filter.trim().toLowerCase();
	const filtered = posts.filter((p) => {
		if (!normalized) return true;
		return (
			p.title.toLowerCase().includes(normalized) ||
			p.author.toLowerCase().includes(normalized)
		);
	});

	if (!filtered.length) {
		return <p className={styles.empty}>No posts found</p>;
	}

	return (
		<ul className={styles.list}>
			{filtered.map((post) => (
				<li key={post.id} className={styles.card}>
					<h3 className={styles.cardTitle}>{post.title}</h3>
					<p className={styles.meta}>Author: {post.author}</p>
					<p className={styles.excerpt}>{post.content}</p>

					<div className={styles.actions}>
						<Link
							href={`/post/${post.id}`}
							className={styles.detailLink}
						>
							Details
						</Link>
						{post.ownerId === user?.uid && (
							<button
								type="button"
								onClick={() => onDelete(post.id, post.version)}
								disabled={deletingId === post.id}
								className={styles.deleteButton}
							>
								{deletingId === post.id ? "Deleting..." : "Delete"}
							</button>
						)}
					</div>
				</li>
			))}
		</ul>
	);
}
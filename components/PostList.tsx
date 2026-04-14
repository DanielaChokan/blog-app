"use client";

import Link from "next/link";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostFilters } from "@/hooks/usePostFilters";
import { useAuthUser } from "@/lib/use-auth-user";
import styles from "./PostList.module.css";

export default function PostList() {
	const { removePost, pendingId } = usePostActions();
	const { filteredPosts } = usePostFilters();
	const { user } = useAuthUser();

	async function onDelete(postId: string, expectedVersion: number) {
		if (!user) return;
		await removePost(postId, expectedVersion);
	}

	if (!filteredPosts.length) {
		return <p className={styles.empty}>No posts found</p>;
	}

	return (
		<ul className={styles.list}>
			{filteredPosts.map((post) => (
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
								disabled={pendingId === post.id}
								className={styles.deleteButton}
							>
								{pendingId === post.id ? "Deleting..." : "Delete"}
							</button>
						)}
					</div>
				</li>
			))}
		</ul>
	);
}
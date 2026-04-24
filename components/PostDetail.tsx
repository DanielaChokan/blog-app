"use client";

import { usePostDetail } from "@/hooks/usePostDetail";
import CommentForm from "./CommentForm";
import { PostWithComments } from "@/types/blog";
import styles from "./PostDetail.module.css";

export default function PostDetail({ id, initialData }: { id: string; initialData?: PostWithComments }) {
    const {
        post,
        error,
        user,
        editing,
        register,
        saveEdit,
        errors,
        isSubmitting,
        startEditing,
        cancelEditing,
    } = usePostDetail(id, initialData);

    if (!post) return <p className={styles.error}>Post not found</p>;

    return (
        <article className={styles.article}>
            {error && <p className={styles.error}>Error: {error}</p>}

            {editing ? (
                <form className={styles.editForm} onSubmit={saveEdit}>
                    <input
                        {...register("title")}
                        className={styles.input}
                    />
                    {errors.title?.message && (
                        <p className={styles.error}>{errors.title.message}</p>
                    )}
                    <textarea
                        {...register("content")}
                        className={styles.textarea}
                        rows={8}
                    />
                    {errors.content?.message && (
                        <p className={styles.error}>{errors.content.message}</p>
                    )}
                    {errors.root?.message && (
                        <p className={styles.error}>{errors.root.message}</p>
                    )}
                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={cancelEditing}
                            className={styles.secondaryButton}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h1 className={styles.heading}>{post.title}</h1>
                    <p className={styles.meta}>Author: {post.author}</p>
                    <p className={styles.content}>{post.content}</p>
                    {post.ownerId === user?.uid && (
                        <button
                            onClick={startEditing}
                            className={styles.editButton}
                        >
                            Edit
                        </button>
                    )}
                </>
            )}

            {!editing && (
                <section className={styles.commentsSection}>
                    <h3 className={styles.commentsTitle}>Comments</h3>
                    <ul className={styles.commentsList}>
                        {(post.comments ?? []).map((c) => (
                            <li key={c.id} className={styles.commentItem}>
                                <p className={styles.commentAuthor}>
                                    {c.author}
                                </p>
                                <p className={styles.commentText}>{c.text}</p>
                            </li>
                        ))}
                    </ul>
                    <CommentForm postId={id} />
                </section>
            )}
        </article>
    );
}

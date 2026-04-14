"use client";

import { useState } from "react";
import { createPostSchema } from "@/lib/zod-schemas";
import { useAppSelector } from "@/store/hooks";
import { usePostActions } from "@/hooks/usePostActions";
import { useAuthUser } from "@/lib/use-auth-user";
import { flattenError } from "zod";
import CommentForm from "./CommentForm";
import styles from "./PostDetail.module.css";

type EditErrors = Partial<Record<"title" | "content", string>>;

export default function PostDetail({ id }: { id: string }) {
    const { updatePost } = usePostActions();
    const { user } = useAuthUser();
    const { selectedPost: post, error } = useAppSelector((s) => s.posts);

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<EditErrors>({});

    function startEditing() {
        if (!post || post.ownerId !== user?.uid) return;
        setTitle(post.title);
        setContent(post.content);
        setErrors({});
        setEditing(true);
    }

    if (!post) return <p className={styles.error}>Post not found</p>;

    async function saveEdit() {
        if (!post || post.ownerId !== user?.uid) {
            setErrors({ title: "You can edit only your own post." });
            return;
        }

        const parsed = createPostSchema
            .pick({ title: true, content: true })
            .safeParse({
                title,
                content,
            });

        if (!parsed.success) {
            const fieldErrors = flattenError(parsed.error).fieldErrors;
            setErrors({
                title: fieldErrors.title?.[0],
                content: fieldErrors.content?.[0],
            });
            return;
        }

        setErrors({});
        try {
            setSaving(true);
            await updatePost(id, {
                ...parsed.data,
                expectedVersion: post.version,
            });
            setEditing(false);
        } finally {
            setSaving(false);
        }
    }

    return (
        <article className={styles.article}>
            {error && <p className={styles.error}>Error: {error}</p>}

            {editing ? (
                <div className={styles.editForm}>
                    <input
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) {
                                setErrors((prev) => ({
                                    ...prev,
                                    title: undefined,
                                }));
                            }
                        }}
                        className={styles.input}
                    />
                    {errors.title && (
                        <p className={styles.error}>{errors.title}</p>
                    )}
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (errors.content) {
                                setErrors((prev) => ({
                                    ...prev,
                                    content: undefined,
                                }));
                            }
                        }}
                        className={styles.textarea}
                        rows={8}
                    />
                    {errors.content && (
                        <p className={styles.error}>{errors.content}</p>
                    )}
                    <div className={styles.actions}>
                        <button
                            onClick={saveEdit}
                            className={styles.primaryButton}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setErrors({});
                            }}
                            className={styles.secondaryButton}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
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

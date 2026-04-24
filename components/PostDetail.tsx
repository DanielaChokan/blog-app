"use client";

import { usePostDetail } from "@/hooks/usePostDetail";
import CommentForm from "./CommentForm";
import { PostWithComments } from "@/types/blog";

export default function PostDetail({
    id,
    initialData,
}: {
    id: string;
    initialData?: PostWithComments;
}) {
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

    if (!post) return <p className="text-sm text-red-600">Post not found</p>;

    return (
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            {error && <p className="text-sm text-red-600">Error: {error}</p>}

            {editing ? (
                <form className="grid gap-2.5" onSubmit={saveEdit}>
                    <input
                        {...register("title")}
                        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-inherit focus:bg-white"
                    />
                    {errors.title?.message && (
                        <p className="text-sm text-red-600">
                            {errors.title.message}
                        </p>
                    )}
                    <textarea
                        {...register("content")}
                        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-inherit focus:bg-white"
                        rows={8}
                    />
                    {errors.content?.message && (
                        <p className="text-sm text-red-600">
                            {errors.content.message}
                        </p>
                    )}
                    {errors.root?.message && (
                        <p className="text-sm text-red-600">
                            {errors.root.message}
                        </p>
                    )}
                    <div className="flex gap-2 pt-1">
                        <button
                            type="submit"
                            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={cancelEditing}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {post.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Author: {post.author}
                    </p>
                    <p className="mt-4 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </p>
                    {post.ownerId === user?.uid && (
                        <button
                            onClick={startEditing}
                            className="mt-4 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            Edit
                        </button>
                    )}
                </>
            )}

            {!editing && (
                <section className="mt-6 border-t border-gray-100 pt-5">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <ul className="mt-2 grid gap-2">
                        {(post.comments ?? []).map((c) => (
                            <li
                                key={c.id}
                                className="rounded-md border border-gray-200 bg-gray-50 p-3"
                            >
                                <p className="text-sm font-medium">
                                    {c.author}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed">
                                    {c.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3">
                        <CommentForm postId={id} />
                    </div>
                </section>
            )}
        </article>
    );
}

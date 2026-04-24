"use client";

import Link from "next/link";
import { usePostActions } from "@/hooks/usePostActions";
import { usePostFilters } from "@/hooks/usePostFilters";
import { useAuthUser } from "@/lib/use-auth-user";

export default function PostList() {
    const { removePost, pendingId } = usePostActions();
    const { filteredPosts } = usePostFilters();
    const { user } = useAuthUser();

    async function onDelete(postId: string, expectedVersion: number) {
        if (!user) return;
        await removePost(postId, expectedVersion);
    }

    if (!filteredPosts.length) {
        return <p className="py-2 text-sm text-gray-500">No posts found</p>;
    }

    return (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredPosts.map((post) => (
                <li
                    key={post.id}
                    className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:border-gray-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]"
                >
                    <h3 className="text-lg font-semibold leading-snug">
                        {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Author: {post.author}
                    </p>
                    <p className="mt-2 line-clamp-3 min-h-[4.2em] text-sm leading-relaxed break-words">
                        {post.content}
                    </p>

                    <div className="mt-auto flex gap-2 pt-3">
                        <Link
                            href={`/post/${post.id}`}
                            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 font-semibold !text-white transition hover:-translate-y-[1px] hover:bg-gray-800 hover:!text-white visited:!text-white"
                        >
                            Details
                        </Link>
                        {post.ownerId === user?.uid && (
                            <button
                                type="button"
                                onClick={() => onDelete(post.id, post.version)}
                                disabled={pendingId === post.id}
                                className="rounded-md border border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 disabled:opacity-60"
                            >
                                {pendingId === post.id
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

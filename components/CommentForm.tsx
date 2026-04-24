"use client";

import { useCommentForm } from "@/hooks/useCommentForm";

export default function CommentForm({ postId }: { postId: string }) {
    const { register, onSubmit, errors, isSubmitting } = useCommentForm(postId);

    return (
        <form
            onSubmit={onSubmit}
            className="mt-4 rounded-lg border border-gray-200 bg-white p-3"
        >
            <h4 className="mb-2 font-medium">Add comment</h4>
            <input
                {...register("author")}
                placeholder="Your name"
                className="mb-2 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-inherit placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.author?.message && (
                <p className="mt-1 text-sm text-red-600">
                    {errors.author.message}
                </p>
            )}
            <textarea
                {...register("text")}
                rows={3}
                placeholder="Comment text"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-inherit placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors.text?.message && (
                <p className="mt-1 text-sm text-red-600">
                    {errors.text.message}
                </p>
            )}
            {errors.root?.message && (
                <p className="mt-1 text-sm text-red-600">
                    {errors.root.message}
                </p>
            )}
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Sending..." : "Send"}
            </button>
        </form>
    );
}

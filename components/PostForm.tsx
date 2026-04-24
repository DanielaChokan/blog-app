"use client";

import { usePostForm } from "@/hooks/usePostForm";

export default function PostForm() {
    const { register, onSubmit, errors, isSubmitting, loading, user } =
        usePostForm();

    const disabled = isSubmitting || loading || !user;

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
        >
            <h2 className="mb-3 text-lg font-semibold tracking-tight">
                Create Post
            </h2>

            <div className="mb-3">
                <input
                    {...register("title")}
                    placeholder="Title"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-inherit placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.title?.message && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                    </p>
                )}
            </div>

            <div className="mb-3">
                <textarea
                    {...register("content")}
                    placeholder="Post content"
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-inherit placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.content?.message && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.content.message}
                    </p>
                )}
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                    <input
                        {...register("author")}
                        placeholder="Author"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-inherit placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    {errors.author?.message && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.author.message}
                        </p>
                    )}
                </div>
                <div>
                    <input
                        {...register("tagsText")}
                        placeholder="Tags separated by commas"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-inherit placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    {errors.tagsText?.message && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.tagsText.message}
                        </p>
                    )}
                </div>
            </div>

            <button
                disabled={disabled}
                type="submit"
                className="w-full rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white transition hover:-translate-y-[1px] hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting
                    ? "Creating..."
                    : loading
                      ? "Checking auth..."
                      : user
                        ? "Create"
                        : "Sign in to create"}
            </button>
            {errors.root?.message && (
                <p className="mt-2 text-sm text-red-600">
                    {errors.root.message}
                </p>
            )}
        </form>
    );
}

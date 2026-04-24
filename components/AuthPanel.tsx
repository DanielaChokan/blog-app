"use client";

import { createPortal } from "react-dom";
import { useAuthPanel } from "@/hooks/useAuthPanel";

export default function AuthPanel() {
    const {
        user,
        loading,
        mode,
        expanded,
        portalTarget,
        signOutPending,
        register,
        onSubmit,
        onSignOut,
        errors,
        isSubmitting,
        openSignIn,
        openSignUp,
        closeForm,
    } = useAuthPanel();

    if (loading) {
        return (
            <p className="text-sm text-gray-500">Checking authentication...</p>
        );
    }

    if (user) {
        return (
            <section className="inline-flex items-center gap-2">
                <p className="text-sm text-gray-900">
                    Signed in as {user.email ?? user.uid}
                </p>
                <button
                    type="button"
                    onClick={onSignOut}
                    disabled={signOutPending}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
                >
                    {signOutPending ? "Signing out..." : "Sign out"}
                </button>
                {errors.root?.message && (
                    <p className="text-sm text-red-600">
                        {errors.root.message}
                    </p>
                )}
            </section>
        );
    }

    const authForm = expanded ? (
        <form
            onSubmit={onSubmit}
            className="grid w-[min(320px,calc(100vw-2.5rem))] gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
        >
            <input
                {...register("email")}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-inherit placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                type="email"
                autoComplete="email"
                placeholder="Email"
            />
            {errors.email?.message && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
            <input
                {...register("password")}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-inherit placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                type="password"
                autoComplete={
                    mode === "sign-up" ? "new-password" : "current-password"
                }
                placeholder="Password"
            />
            {errors.password?.message && (
                <p className="text-sm text-red-600">
                    {errors.password.message}
                </p>
            )}

            <div className="flex gap-2">
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                    {isSubmitting
                        ? mode === "sign-in"
                            ? "Signing in..."
                            : "Creating account..."
                        : mode === "sign-in"
                          ? "Sign in"
                          : "Create account"}
                </button>
                <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={closeForm}
                >
                    Cancel
                </button>
            </div>

            {errors.root?.message && (
                <p className="text-sm text-red-600">{errors.root.message}</p>
            )}
        </form>
    ) : null;

    return (
        <section className="relative justify-self-end">
            <div className="inline-flex justify-end gap-2">
                <button
                    type="button"
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                        mode === "sign-in" && expanded
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 bg-white text-gray-900"
                    }`}
                    onClick={openSignIn}
                >
                    Sign in
                </button>
                <button
                    type="button"
                    className={`rounded-md border px-3 py-1.5 text-sm ${
						mode === "sign-up" && expanded
							? "border-gray-900 bg-gray-900 text-white"
							: "border-gray-300 bg-white text-gray-900"
					}`}
                    onClick={openSignUp}
                >
                    Sign up
                </button>
            </div>

            {!portalTarget && authForm}
            {portalTarget && authForm
                ? createPortal(authForm, portalTarget)
                : null}
        </section>
    );
}

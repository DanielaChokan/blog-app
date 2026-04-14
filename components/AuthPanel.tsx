"use client";

import { createPortal } from "react-dom";
import { useAuthPanel } from "@/hooks/useAuthPanel";
import styles from "./AuthPanel.module.css";

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
        return <p className={styles.loading}>Checking authentication...</p>;
    }

    if (user) {
        return (
            <section className={styles.authRow}>
                <p className={styles.status}>Signed in as {user.email ?? user.uid}</p>
                <button
                    type="button"
                    onClick={onSignOut}
                    disabled={signOutPending}
                    className={styles.secondaryButton}
                >
                    {signOutPending ? "Signing out..." : "Sign out"}
                </button>
                {errors.root?.message && <p className={styles.error}>{errors.root.message}</p>}
            </section>
        );
    }

    const authForm = expanded ? (
        <form
            onSubmit={onSubmit}
            className={`${styles.panel} ${portalTarget ? styles.portalPanel : ""}`}
        >
            <input
                {...register("email")}
                className={styles.input}
                type="email"
                autoComplete="email"
                placeholder="Email"
            />
            {errors.email?.message && <p className={styles.error}>{errors.email.message}</p>}
            <input
                {...register("password")}
                className={styles.input}
                type="password"
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                placeholder="Password"
            />
            {errors.password?.message && <p className={styles.error}>{errors.password.message}</p>}

            <div className={styles.formActions}>
                <button disabled={isSubmitting} type="submit" className={styles.primaryButton}>
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
                    className={styles.secondaryButton}
                    onClick={closeForm}
                >
                    Cancel
                </button>
            </div>

            {errors.root?.message && <p className={styles.error}>{errors.root.message}</p>}
        </form>
    ) : null;

    return (
        <section className={styles.authWrap}>
            <div className={styles.modeRow}>
                <button
                    type="button"
                    className={mode === "sign-in" && expanded ? styles.activeMode : styles.modeButton}
                    onClick={openSignIn}
                >
                    Sign in
                </button>
                <button
                    type="button"
                    className={mode === "sign-up" && expanded ? styles.activeMode : styles.modeButton}
                    onClick={openSignUp}
                >
                    Sign up
                </button>
            </div>

            {!portalTarget && authForm}
            {portalTarget && authForm ? createPortal(authForm, portalTarget) : null}
        </section>
    );
}
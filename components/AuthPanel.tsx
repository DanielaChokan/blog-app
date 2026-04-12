"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebase-client";
import { useAuthUser } from "@/lib/use-auth-user";
import styles from "./AuthPanel.module.css";

type Mode = "sign-in" | "sign-up";

export default function AuthPanel() {
    const { user, loading } = useAuthUser();
    const [mode, setMode] = useState<Mode>("sign-in");
    const [expanded, setExpanded] = useState(false);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPortalTarget(document.getElementById("auth-form-slot"));
    }, []);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        try {
            setPending(true);
            if (mode === "sign-in") {
                await signInWithEmailAndPassword(clientAuth, email, password);
            } else {
                await createUserWithEmailAndPassword(clientAuth, email, password);
            }
            setPassword("");
            setExpanded(false);
        } catch (submitError) {
            const message =
                submitError instanceof Error
                    ? submitError.message
                    : "Authentication failed";
            setError(message);
        } finally {
            setPending(false);
        }
    }

    async function onSignOut() {
        setError(null);
        try {
            setPending(true);
            await signOut(clientAuth);
        } catch (signOutError) {
            const message =
                signOutError instanceof Error
                    ? signOutError.message
                    : "Sign out failed";
            setError(message);
        } finally {
            setPending(false);
        }
    }

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
                    disabled={pending}
                    className={styles.secondaryButton}
                >
                    {pending ? "Signing out..." : "Sign out"}
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </section>
        );
    }

    const authForm = expanded ? (
        <form
            onSubmit={onSubmit}
            className={`${styles.panel} ${portalTarget ? styles.portalPanel : ""}`}
        >
            <input
                className={styles.input}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                required
            />
            <input
                className={styles.input}
                type="password"
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                minLength={6}
                required
            />

            <div className={styles.formActions}>
                <button disabled={pending} type="submit" className={styles.primaryButton}>
                    {pending
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
                    onClick={() => {
                        setExpanded(false);
                        setError(null);
                    }}
                >
                    Cancel
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}
        </form>
    ) : null;

    return (
        <section className={styles.authWrap}>
            <div className={styles.modeRow}>
                <button
                    type="button"
                    className={mode === "sign-in" && expanded ? styles.activeMode : styles.modeButton}
                    onClick={() => {
                        setMode("sign-in");
                        setExpanded(true);
                        setError(null);
                    }}
                >
                    Sign in
                </button>
                <button
                    type="button"
                    className={mode === "sign-up" && expanded ? styles.activeMode : styles.modeButton}
                    onClick={() => {
                        setMode("sign-up");
                        setExpanded(true);
                        setError(null);
                    }}
                >
                    Sign up
                </button>
            </div>

            {!portalTarget && authForm}
            {portalTarget && authForm ? createPortal(authForm, portalTarget) : null}
        </section>
    );
}
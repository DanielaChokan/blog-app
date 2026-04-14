"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebase-client";
import { useAuthUser } from "@/lib/use-auth-user";
import { getClientErrorMessage } from "@/lib/client-error";

export type AuthMode = "sign-in" | "sign-up";

const authFormSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authFormSchema>;

export function useAuthPanel() {
    const { user, loading } = useAuthUser();
    const [mode, setMode] = useState<AuthMode>("sign-in");
    const [expanded, setExpanded] = useState(false);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    const [signOutPending, setSignOutPending] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AuthFormValues>({
        resolver: zodResolver(authFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        setPortalTarget(document.getElementById("auth-form-slot"));
    }, []);

    const onSubmit = handleSubmit(async ({ email, password }) => {
        setError("root", { message: "" });

        try {
            if (mode === "sign-in") {
                await signInWithEmailAndPassword(clientAuth, email, password);
            } else {
                await createUserWithEmailAndPassword(clientAuth, email, password);
            }
            reset({
                email,
                password: "",
            });
            setExpanded(false);
        } catch (submitError) {
            const message = getClientErrorMessage(submitError, "Authentication failed");
            setError("root", { message });
        }
    });

    async function onSignOut() {
        setError("root", { message: "" });
        try {
            setSignOutPending(true);
            await signOut(clientAuth);
        } catch (signOutError) {
            const message = getClientErrorMessage(signOutError, "Sign out failed");
            setError("root", { message });
        } finally {
            setSignOutPending(false);
        }
    }

    function openSignIn() {
        setMode("sign-in");
        setExpanded(true);
        reset({ email: "", password: "" });
    }

    function openSignUp() {
        setMode("sign-up");
        setExpanded(true);
        reset({ email: "", password: "" });
    }

    function closeForm() {
        setExpanded(false);
        setError("root", { message: "" });
    }

    return {
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
    };
}

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { clientAuth } from "@/lib/firebase-client";

type AuthState = {
    user: User | null;
    loading: boolean;
};

export function useAuthUser(): AuthState {
    const [user, setUser] = useState<User | null>(clientAuth.currentUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(clientAuth, (nextUser) => {
            setUser(nextUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return { user, loading };
}
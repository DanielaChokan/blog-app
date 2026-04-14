"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createPostSchema } from "@/lib/zod-schemas";
import { useAppSelector } from "@/store/hooks";
import { usePostActions } from "@/hooks/usePostActions";
import { useAuthUser } from "@/lib/use-auth-user";

const editPostSchema = createPostSchema.pick({ title: true, content: true });

type EditFormValues = {
    title: string;
    content: string;
};

export function usePostDetail(id: string) {
    const { updatePost } = usePostActions();
    const { user } = useAuthUser();
    const { selectedPost: post, error } = useAppSelector((s) => s.posts);
    const [editing, setEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<EditFormValues>({
        resolver: zodResolver(editPostSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    function startEditing() {
        if (!post || post.ownerId !== user?.uid) return;
        reset({
            title: post.title,
            content: post.content,
        });
        setEditing(true);
    }

    const saveEdit = handleSubmit(async (values) => {
        if (!post || post.ownerId !== user?.uid) {
            setError("root", { message: "You can edit only your own post." });
            return;
        }

        await updatePost(id, {
            ...values,
            expectedVersion: post.version,
        });
        setEditing(false);
    });

    function cancelEditing() {
        if (!post) return;
        setEditing(false);
        reset({
            title: post.title,
            content: post.content,
        });
    }

    return {
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
    };
}

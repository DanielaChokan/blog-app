"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createPostSchema } from "@/lib/zod-schemas";
import { usePostDetailSWR } from "@/hooks/usePostDetailSWR";
import { useAuthUser } from "@/lib/use-auth-user";
import { PostWithComments } from "@/types/blog";

const editPostSchema = createPostSchema.pick({ title: true, content: true });

type EditFormValues = {
    title: string;
    content: string;
};

export function usePostDetail(id: string, initialData?: PostWithComments) {
    const { post, error, updatePost } = usePostDetailSWR(id, initialData);
    const { user } = useAuthUser();
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
        try {
            await updatePost({...values, expectedVersion: post.version});
            setEditing(false);
        } catch (error) {
            setError("root", { message: "Failed to save changes. Try again." });
        }
        
    });

    function cancelEditing() {
        if (!post) return;
        setEditing(false);
        reset({
            title: post.title,
            content: post.content,
        });
    }

    return { post, error, user, editing, register, saveEdit, errors, isSubmitting, startEditing, cancelEditing };
}

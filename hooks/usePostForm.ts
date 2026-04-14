"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPostSchema } from "@/lib/zod-schemas";
import { createPostThunk } from "@/store/slices/postsSlice";
import { useAppDispatch } from "@/store/hooks";
import { useAuthUser } from "@/lib/use-auth-user";
import { getClientErrorMessage } from "@/lib/client-error";

const postFormSchema = z
    .object({
        title: z.string(),
        content: z.string(),
        author: z.string(),
        tagsText: z.string().default(""),
    })
    .transform((values) => ({
        title: values.title,
        content: values.content,
        author: values.author,
        tags: values.tagsText
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
    }))
    .pipe(createPostSchema);

type PostFormValues = z.input<typeof postFormSchema>;

export function usePostForm() {
    const dispatch = useAppDispatch();
    const { user, loading } = useAuthUser();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<PostFormValues>({
        resolver: zodResolver(postFormSchema),
        defaultValues: {
            title: "",
            content: "",
            author: "",
            tagsText: "",
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        if (!user) {
            setError("root", { message: "Please sign in to create a post." });
            return;
        }

        const parsed = postFormSchema.parse(values);

        try {
            await dispatch(createPostThunk(parsed)).unwrap();
            reset();
        } catch (error) {
            const message = getClientErrorMessage(error, "Failed to create post");
            setError("root", { message });
        }
    });

    return {
        register,
        onSubmit,
        errors,
        isSubmitting,
        loading,
        user,
    };
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createCommentSchema } from "@/lib/zod-schemas";
import { usePostDetailSWR } from "@/hooks/usePostDetailSWR";
import { getClientErrorMessage } from "@/lib/client-error";

type CommentFormValues = {
    author: string;
    text: string;
};

export function useCommentForm(postId: string) {
    const { addComment } = usePostDetailSWR(postId);
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CommentFormValues>({
        resolver: zodResolver(createCommentSchema),
        defaultValues: {
            author: "",
            text: "",
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        try {
            await addComment( values );
            reset();
        } catch (submitError) {
            const message = getClientErrorMessage(
                submitError,
                "Failed to send comment",
            );
            setError("root", { message });
        }
    });

    return { register, onSubmit, errors, isSubmitting };
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createCommentSchema } from "@/lib/zod-schemas";
import { addCommentThunk } from "@/store/slices/postsSlice";
import { useAppDispatch } from "@/store/hooks";
import { getClientErrorMessage } from "@/lib/client-error";

type CommentFormValues = {
    author: string;
    text: string;
};

export function useCommentForm(postId: string) {
    const dispatch = useAppDispatch();
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
            await dispatch(addCommentThunk({ postId, data: values })).unwrap();
            reset();
        } catch (submitError) {
            const message = getClientErrorMessage(
                submitError,
                "Failed to send comment",
            );
            setError("root", { message });
        }
    });

    return {
        register,
        onSubmit,
        errors,
        isSubmitting,
    };
}

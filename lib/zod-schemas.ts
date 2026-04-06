import { z } from "zod";

export const createPostSchema = z.object({
    title: z
        .string({ message: "Title is required" })
        .trim()
        .min(1, "Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(120, "Title must be <= 120 characters"),
    content: z
        .string({ message: "Content is required" })
        .trim()
        .min(1, "Content is required")
        .min(20, "Content must be at least 20 characters")
        .max(5000, "Content must be <= 5000 characters"),
    author: z
        .string({ message: "Author is required" })
        .trim()
        .min(1, "Author is required")
        .min(2, "Author must be at least 2 characters")
        .max(60, "Author must be <= 60 characters"),
    tags: z.array(z.string().min(1).max(20)).max(10),
});

export const updatePostSchema = createPostSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field must be provided",
    });

export const createCommentSchema = z.object({
    author: z.string().min(2).max(60),
    text: z.string().min(2).max(1000),
});

export type CreatePostSchemaType = z.infer<typeof createPostSchema>;
export type UpdatePostSchemaType = z.infer<typeof updatePostSchema>;
export type CreateCommentSchemaType = z.infer<typeof createCommentSchema>;

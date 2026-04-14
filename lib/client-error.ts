import { ApiClientError } from "@/lib/api-client";

export function getClientErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof ApiClientError) {
        return error.message || fallback;
    }

    if (error instanceof Error) {
        return error.message || fallback;
    }

    return fallback;
}
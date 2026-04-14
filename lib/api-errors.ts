import { NextResponse } from "next/server";
import { ApiErrorBody, ApiErrorCode } from "@/types/api-error";

function jsonError(status: number, message: string, code: ApiErrorCode, details?: unknown) {
    const body: ApiErrorBody = { message, code };
    if (typeof details !== "undefined") {
        body.details = details;
    }
    return NextResponse.json(body, { status });
}

export function badRequest(message: string, details?: unknown) {
    return jsonError(400, message, "BAD_REQUEST", details);
}

export function unauthorized(message = "Unauthorized") {
    return jsonError(401, message, "UNAUTHORIZED");
}

export function forbidden(message = "Forbidden") {
    return jsonError(403, message, "FORBIDDEN");
}

export function notFound(message = "Not found") {
    return jsonError(404, message, "NOT_FOUND");
}

export function conflict(message: string, details?: unknown) {
    return jsonError(409, message, "CONFLICT", details);
}

export function validationError(message = "Validation failed", details?: unknown) {
    return jsonError(422, message, "VALIDATION_ERROR", details);
}

export function serverError(message = "Internal server error", details?: unknown) {
    const safeDetails = process.env.NODE_ENV === "production" ? undefined : details;
    return jsonError(500, message, "INTERNAL_ERROR", safeDetails);
}

export function fromUnknownError(error: unknown, fallbackMessage: string) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
        return unauthorized();
    }
    return serverError(fallbackMessage, String(error));
}
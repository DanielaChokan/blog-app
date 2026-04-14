export type ApiErrorCode =
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "VALIDATION_ERROR"
    | "INTERNAL_ERROR";

export type ApiErrorBody = {
    message: string;
    code: ApiErrorCode;
    details?: unknown;
};
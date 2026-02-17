import { toast } from "sonner";
import { ApiError } from "./api-client";

export function getErrorMessage(error: unknown): string {
  if (
    error instanceof ApiError ||
    (error !== null && typeof error === "object" && "status" in error && "data" in error)
  ) {
    const errorWithData = error as { data: unknown; message?: string };
    const data = errorWithData.data;

    if (data !== null && typeof data === "object") {
      const d = data as Record<string, unknown>;

      if (d.message) {
        if (Array.isArray(d.message)) {
          return d.message.join(", ");
        }
        return String(d.message);
      }

      if (typeof d.error === "string") {
        return d.error;
      }
    }

    return errorWithData.message || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

export function handleApiError(error: unknown, fallbackMessage: string = "Operation failed") {
  console.error(fallbackMessage, error);
  const message = getErrorMessage(error);
  toast.error(message || fallbackMessage);
}

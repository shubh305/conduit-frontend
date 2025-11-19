import { toast } from "sonner";
import { ApiError } from "./api-client";

interface ApiErrorData {
  message?: string | string[];
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.data && typeof error.data === 'object' && 'message' in error.data) {
      const data = error.data as ApiErrorData;
      const msg = data.message;
      if (Array.isArray(msg)) {
        return msg.join(", ");
      }
      return String(msg);
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export function handleApiError(error: unknown, fallbackMessage: string = "Operation failed") {
  console.error(fallbackMessage, error);
  const message = getErrorMessage(error);
  toast.error(message || fallbackMessage);
}

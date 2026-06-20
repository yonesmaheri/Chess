import axios from "axios";

export function getErrorMessage(
  error: unknown,
  fallback = "مشکلی پیش آمد. دوباره تلاش کنید.",
) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

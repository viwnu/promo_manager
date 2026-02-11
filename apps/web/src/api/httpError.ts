export function isUnauthorized(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeAny = error as { status?: number; response?: { status?: number } };
  if (typeof maybeAny.status === "number") {
    return maybeAny.status === 401;
  }

  if (typeof maybeAny.response?.status === "number") {
    return maybeAny.response.status === 401;
  }

  return false;
}

export function normalizeErrorMessage(
  error: unknown,
  fallback = "Unexpected error",
): string {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const maybeAny = error as {
      message?: string;
      statusText?: string;
      error?: string | { message?: string };
    };

    if (typeof maybeAny.error === "string") {
      return maybeAny.error;
    }

    if (typeof maybeAny.error?.message === "string") {
      return maybeAny.error.message;
    }

    if (typeof maybeAny.message === "string") {
      return maybeAny.message;
    }

    if (typeof maybeAny.statusText === "string" && maybeAny.statusText) {
      return maybeAny.statusText;
    }
  }

  return fallback;
}

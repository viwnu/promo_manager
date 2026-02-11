import { Api } from "./source/Api";

let onUnauthorizedHandler: (() => void) | null = null;

export function onUnauthorized(handler: (() => void) | null) {
  onUnauthorizedHandler = handler;
}

const customFetch: typeof fetch = (input, init) => {
  const requestInit: RequestInit = {
    ...(init || {}),
    credentials: "include",
  };

  return fetch(input, requestInit).then((response) => {
    if (response.status === 401) {
      onUnauthorizedHandler?.();
    }
    return response;
  });
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is not set. Create a .env file (see .env.example).",
  );
}

export const api = new Api({
  baseUrl,
  baseApiParams: {
    credentials: "include",
  },
  customFetch,
});

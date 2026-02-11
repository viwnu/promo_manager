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

export const api = new Api({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  baseApiParams: {
    credentials: "include",
  },
  customFetch,
});

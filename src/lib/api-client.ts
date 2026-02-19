import { getAuthCookie, setAuthCookie } from "./auth-cookies";

const IS_SERVER = typeof window === "undefined";
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const INTERNAL_API_URL = process.env.CONDUIT_INTERNAL_API_URL;

const API_URL = IS_SERVER && INTERNAL_API_URL ? INTERNAL_API_URL : PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  tenantId?: string;
  token?: string;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID;

type UnauthorizedHandler = () => void;
let onUnauthorizedHandler: UnauthorizedHandler | null = null;

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorizedHandler = handler;
}

export async function fetchApi<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { tenantId, headers, token, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    ...(rest.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(headers as Record<string, string>),
  };

  const effectiveTenantId = tenantId || DEFAULT_TENANT_ID;
  if (effectiveTenantId) {
    requestHeaders["x-tenant-id"] = effectiveTenantId;
  }

  const authToken =
    token ||
    (typeof window !== "undefined" ? getAuthCookie("accessToken") || localStorage.getItem("accessToken") : null);
  if (authToken) {
    requestHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const res = await fetch(url, {
    headers: requestHeaders,
    ...rest,
  });

  // Handle 401 with Automatic Refresh
  if (res.status === 401 && !path.includes("/auth/login") && !path.includes("/auth/refresh")) {
    if (typeof window !== "undefined") {
      const refreshToken = getAuthCookie("refreshToken") || localStorage.getItem("refreshToken");

      if (refreshToken) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              return fetchApi<T>(path, { ...options, token });
            })
            .catch(err => {
              throw err;
            });
        }

        isRefreshing = true;

        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(DEFAULT_TENANT_ID && { "x-tenant-id": DEFAULT_TENANT_ID }),
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshData;

            setAuthCookie("accessToken", newAccessToken);
            setAuthCookie("refreshToken", newRefreshToken);
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            processQueue(null, newAccessToken);
            isRefreshing = false;

            return fetchApi<T>(path, { ...options, token: newAccessToken });
          } else {
            throw new Error("Refresh failed");
          }
        } catch (error) {
          processQueue(error, null);
          isRefreshing = false;
        }
      }
    }

    if (onUnauthorizedHandler) {
      onUnauthorizedHandler();
    }
  }

  let data;
  try {
    data = await res.json();
  } catch {
    if (res.ok && res.status !== 204) {
      throw new ApiError(res.status, "Invalid JSON response", null);
    }
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, data);
  }

  return data as T;
}

export async function uploadFile(file: File, tenantId?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchApi<{ url: string }>("/media/upload", {
    method: "POST",
    body: formData,
    tenantId,
  });

  return response.url;
}

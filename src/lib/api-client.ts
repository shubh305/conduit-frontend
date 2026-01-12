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

  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
  if (authToken) {
    requestHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const res = await fetch(url, {
    headers: requestHeaders,
    ...rest,
  });

  if (res.status === 401 && onUnauthorizedHandler) {
    onUnauthorizedHandler();
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, data);
  }

  return data as T;
}

export async function uploadImage(file: File, tenantId?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchApi<{ url: string }>("/media/upload", {
    method: "POST",
    body: formData,
    tenantId,
  });

  return response.url;
}

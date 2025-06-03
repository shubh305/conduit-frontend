const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface FetchOptions extends RequestInit {
  tenantId?: string;
}

export async function fetchApi<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { tenantId, headers, ...rest } = options;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (tenantId) {
    requestHeaders["X-Tenant-ID"] = tenantId;
  }

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const res = await fetch(url, {
    headers: requestHeaders,
    ...rest,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  try {
    return await res.json();
  } catch {
    return {} as T;
  }
}

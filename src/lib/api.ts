const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthToken() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("authToken");
  if (!token || token === "undefined" || token === "null") return null;

  return token;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;

    try {
      const data = await res.json();
      errorMessage = data.message || JSON.stringify(data);
    } catch {
      const text = await res.text().catch(() => "");
      if (text) errorMessage = text;
    }

    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    }

    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

function authHeaders(includeJson = true): HeadersInit {
  const token = getAuthToken();

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: authHeaders(false),
    credentials: "include",
  });

  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(body),
    credentials: "include",
  });

  return handleResponse<T>(res);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(body),
    credentials: "include",
  });

  return handleResponse<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: authHeaders(true),
    body: JSON.stringify(body),
    credentials: "include",
  });

  return handleResponse<T>(res);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: authHeaders(false),
    credentials: "include",
  });

  return handleResponse<T>(res);
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
    credentials: "include",
  });

  return handleResponse<T>(res);
}
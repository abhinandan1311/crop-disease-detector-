export type Scan = {
  id: string;
  user_id: string;
  image_path: string;
  crop: string;
  disease: string;
  confidence: number;
  is_healthy: boolean;
  top_candidates: {
    crop: string;
    disease: string;
    confidence: number;
    is_healthy: boolean;
  }[];
  created_at: string;
};

export type Disease = {
  id: string;
  category?: string;
  crop: string;
  name: string;
  description: string;
  recommendation: string;
};

export type Diagnosis = {
  scan_id: string;
  prediction: Scan["top_candidates"][number];
  top_candidates: Scan["top_candidates"];
  disease_info: Disease | null;
  image_path: string;
  created_at: string | null;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export async function apiRequest<T>(
  path: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      `Could not reach the backend at ${API_URL}. Start FastAPI and check NEXT_PUBLIC_API_URL.`,
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      typeof payload?.detail === "string"
        ? payload.detail
        : `Request failed with status ${response.status}.`;
    throw new Error(detail);
  }
  return payload as T;
}

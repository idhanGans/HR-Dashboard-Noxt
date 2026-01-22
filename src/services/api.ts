const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiErrorBody = {
  message?: string | string[];
};

const buildUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
};

const readErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as ApiErrorBody;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (typeof data?.message === "string") return data.message;
  } catch {
    return undefined;
  }
  return undefined;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> => {
  const headers = new Headers(options.headers);

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = (await readErrorMessage(response)) ?? response.statusText;
    throw new ApiError(message || "Request failed", response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
};

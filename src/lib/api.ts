/**
 * API client with authentication support and automatic token refresh.
 *
 * All CRUD operations automatically include the auth token and handle
 * 401 responses by attempting a token refresh before failing.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Token storage keys (must match AuthContext)
const ACCESS_TOKEN_KEY = "vittion_access_token";
const REFRESH_TOKEN_KEY = "vittion_refresh_token";
const TOKEN_EXPIRY_KEY = "vittion_token_expiry";

// Get stored access token
function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// Attempt to refresh the access token
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // Clear tokens on refresh failure
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      return false;
    }

    const data = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    const expiry = Date.now() + data.expires_in * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    return true;
  } catch {
    return false;
  }
}

// --- Helper for authenticated requests with auto-refresh ---
async function apiRequest(
  path: string,
  method = "GET",
  body?: unknown,
  retry = true,
): Promise<unknown> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, options);

  // Handle 401 - try to refresh token once
  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry with new token
      return apiRequest(path, method, body, false);
    }
    // Redirect to login if refresh failed
    window.location.href = "/login";
    throw new Error("Authentication required");
  }

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  return res.json();
}

// --- Images ---
export const fetchImages = () => apiRequest("/images");
export const fetchImage = (id: number) => apiRequest(`/images/${id}`);
export const createImage = (data: unknown) =>
  apiRequest("/images", "POST", data);
export const updateImage = (id: number, data: unknown) =>
  apiRequest(`/images/${id}`, "PUT", data);
export const deleteImage = (id: number) =>
  apiRequest(`/images/${id}`, "DELETE");

// --- Designs ---
export const fetchDesigns = () => apiRequest("/designs");
export const createDesign = (data: unknown) =>
  apiRequest("/designs", "POST", data);
export const updateDesign = (id: number, data: unknown) =>
  apiRequest(`/designs/${id}`, "PUT", data);
export const deleteDesign = (id: number) =>
  apiRequest(`/designs/${id}`, "DELETE");

// --- Treatments ---
export const fetchTreatments = () => apiRequest("/treatments");
export const createTreatment = (data: unknown) =>
  apiRequest("/treatments", "POST", data);
export const updateTreatment = (id: number, data: unknown) =>
  apiRequest(`/treatments/${id}`, "PUT", data);
export const deleteTreatment = (id: number) =>
  apiRequest(`/treatments/${id}`, "DELETE");

// --- Materials ---
export const fetchMaterials = () => apiRequest("/materials");
export const createMaterial = (data: unknown) =>
  apiRequest("/materials", "POST", data);
export const updateMaterial = (id: number, data: unknown) =>
  apiRequest(`/materials/${id}`, "PUT", data);
export const deleteMaterial = (id: number) =>
  apiRequest(`/materials/${id}`, "DELETE");

// --- Lenses (public GET endpoints, protected mutations) ---
export const fetchLenses = () => apiRequest("/lenses");
export const fetchLens = (id: number) => apiRequest(`/lenses/${id}`);
export const createLens = (data: unknown) =>
  apiRequest("/lenses", "POST", data);
export const updateLens = (id: number, data: unknown) =>
  apiRequest(`/lenses/${id}`, "PUT", data);
export const deleteLens = (id: number) => apiRequest(`/lenses/${id}`, "DELETE");

// --- Relationships ---
export const linkProduct = (type: string, id: number, image_id: number) =>
  apiRequest("/link", "POST", { type, id, image_id });

export const unlinkProduct = (type: string, id: number) =>
  apiRequest("/unlink", "POST", { type, id });

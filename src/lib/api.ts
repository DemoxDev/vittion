const API_BASE_URL = "http://localhost:5000/api";

// --- Helper for generic requests ---
async function apiRequest(path: string, method = "GET", body?: any) {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

// --- Images ---
export const fetchImages = () => apiRequest("/images");
export const fetchImage = (id: number) => apiRequest(`/images/${id}`);
export const createImage = (data: any) => apiRequest("/images", "POST", data);
export const updateImage = (id: number, data: any) =>
  apiRequest(`/images/${id}`, "PUT", data);
export const deleteImage = (id: number) =>
  apiRequest(`/images/${id}`, "DELETE");

// --- Designs ---
export const fetchDesigns = () => apiRequest("/designs");
export const createDesign = (data: any) => apiRequest("/designs", "POST", data);
export const updateDesign = (id: number, data: any) =>
  apiRequest(`/designs/${id}`, "PUT", data);
export const deleteDesign = (id: number) =>
  apiRequest(`/designs/${id}`, "DELETE");

// --- Treatments ---
export const fetchTreatments = () => apiRequest("/treatments");
export const createTreatment = (data: any) =>
  apiRequest("/treatments", "POST", data);
export const updateTreatment = (id: number, data: any) =>
  apiRequest(`/treatments/${id}`, "PUT", data);
export const deleteTreatment = (id: number) =>
  apiRequest(`/treatments/${id}`, "DELETE");

// --- Materials ---
export const fetchMaterials = () => apiRequest("/materials");
export const createMaterial = (data: any) =>
  apiRequest("/materials", "POST", data);
export const updateMaterial = (id: number, data: any) =>
  apiRequest(`/materials/${id}`, "PUT", data);
export const deleteMaterial = (id: number) =>
  apiRequest(`/materials/${id}`, "DELETE");

// --- Relationships ---
export const linkProduct = (type: string, id: number, image_id: number) =>
  apiRequest("/link", "POST", { type, id, image_id });

export const unlinkProduct = (type: string, id: number) =>
  apiRequest("/unlink", "POST", { type, id });

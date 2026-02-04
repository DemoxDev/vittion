const API_BASE_URL = "http://localhost:5000/api";

export async function fetchImages() {
  const res = await fetch(`${API_BASE_URL}/images`);
  if (!res.ok) throw new Error("Failed to fetch images");
  return res.json();
}

export async function fetchDesigns() {
  const res = await fetch(`${API_BASE_URL}/designs`);
  if (!res.ok) throw new Error("Failed to fetch designs");
  return res.json();
}

export async function fetchTreatments() {
  const res = await fetch(`${API_BASE_URL}/treatments`);
  if (!res.ok) throw new Error("Failed to fetch treatments");
  return res.json();
}

export async function fetchMaterials() {
  const res = await fetch(`${API_BASE_URL}/materials`);
  if (!res.ok) throw new Error("Failed to fetch materials");
  return res.json();
}

export async function unlinkProduct(type: string, id: number) {
  const res = await fetch(`${API_BASE_URL}/unlink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, id }),
  });
  if (!res.ok) throw new Error("Failed to unlink product");
  return res.json();
}

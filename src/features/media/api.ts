import { fetchApi } from "@/lib/api-client";

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchApi<{ url: string; filename: string }>("/media/upload", {
    method: "POST",
    body: formData,
  });
}

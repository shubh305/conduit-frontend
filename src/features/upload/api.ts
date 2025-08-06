import { fetchApi } from "@/lib/api-client";

export interface UploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchApi<UploadResponse>("/media/upload", {
    method: "POST",
    body: formData,

    headers: {}, 
  });
}

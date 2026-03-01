import { fetchApi } from "@/lib/api-client";
import { getMediaUrl } from "@/lib/utils";

export interface UploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchApi<UploadResponse>("/media/upload", {
    method: "POST",
    body: formData,
    headers: {},
  });

  return {
    ...res,
    url: getMediaUrl(res.url) || res.url,
  };
}

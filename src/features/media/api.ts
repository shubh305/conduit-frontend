import { fetchApi } from "@/lib/api-client";
import { getMediaUrl } from "@/lib/utils";

export async function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchApi<{ url: string; filename: string }>("/media/upload", {
    method: "POST",
    body: formData,
  });

  return {
    ...res,
    url: getMediaUrl(res.url) || res.url,
  };
}

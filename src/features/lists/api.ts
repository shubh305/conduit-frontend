import { fetchApi } from "@/lib/api-client";
import { CreateListDto, ReadingList, UpdateListDto } from "./types";

export const createList = (data: CreateListDto) => {
  return fetchApi<ReadingList>("/lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getMyLists = () => {
  return fetchApi<ReadingList[]>("/lists");
};

export const getList = (id: string) => {
  return fetchApi<ReadingList>(`/lists/${id}`);
};

export const updateList = (id: string, data: UpdateListDto) => {
  return fetchApi<ReadingList>(`/lists/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteList = (id: string) => {
  return fetchApi(`/lists/${id}`, {
    method: "DELETE",
  });
};

export const addItemToList = (listId: string, postId: string) => {
  return fetchApi<ReadingList>(`/lists/${listId}/items`, {
    method: "POST",
    body: JSON.stringify({ postId }),
  });
};

export const removeItemFromList = (listId: string, postId: string) => {
  return fetchApi<ReadingList>(`/lists/${listId}/items/${postId}`, {
    method: "DELETE",
  });
};

export const checkPostLists = (postId: string) => {
  return fetchApi<string[]>(`/lists/check/${postId}`);
};

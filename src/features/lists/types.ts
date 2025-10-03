// ReadingListItem definition
export interface ReadingListItem {
  postId: string;
  addedAt: string;
}

export interface ReadingList {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  isSystem: boolean;
  userId: string;
  items: ReadingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateListDto {
  name: string;
  description?: string;
  isPrivate?: boolean;
  isSystem?: boolean;
}

export interface UpdateListDto {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  isSystem?: boolean;
}

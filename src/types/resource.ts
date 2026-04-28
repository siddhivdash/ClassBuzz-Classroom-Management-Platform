export type ResourceType = "pdf" | "doc" | "image" | "link" | "file";

export type Resource = {
  _id: string;
  title: string;
  type: ResourceType;
  subject: string;
  fileUrl?: string;
  linkUrl?: string;
  originalFileName?: string;
  size?: number;
  mimeType?: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  updatedAt: string;
};
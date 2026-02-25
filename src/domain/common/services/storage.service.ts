export interface GenerateUploadUrlParams {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}

export interface UploadUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export interface UploadFileParams {
  buffer: Buffer;
  key: string;
  contentType: string;
}

export interface GenerateKeyParams {
  context: string;
  entityId: string;
  filename: string;
  subfolder?: string;
}

export interface StorageService {
  generateUploadUrl(params: GenerateUploadUrlParams): Promise<UploadUrlResult>;
  uploadFile(params: UploadFileParams): Promise<string>;
  deleteFile(key: string): Promise<void>;
  getPublicUrl(key: string): string;
  extractKeyFromUrl(url: string): string | null;
  generateKey(params: GenerateKeyParams): string;
}

export const STORAGE_SERVICE = 'STORAGE_SERVICE';

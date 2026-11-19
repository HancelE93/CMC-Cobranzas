export interface UploadFileOptions {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
}

export interface StoragePort {
  uploadFile(options: UploadFileOptions): Promise<string>;
  getFile(fileUrlOrKey: string): Promise<{ buffer: Buffer; mimeType: string } | null>;
  deleteFile?(fileUrl: string): Promise<void>;
}

export const STORAGE_PORT = Symbol('StoragePort');


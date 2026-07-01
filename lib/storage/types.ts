export interface StorageAdapter {
  uploadFile(file: File, prefix?: string): Promise<string>;
  deleteFile(url: string): Promise<void>;
}

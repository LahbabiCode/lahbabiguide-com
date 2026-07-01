import { StorageAdapter } from './types';
import { VercelBlobAdapter } from './vercel-blob';
import { LocalStorageAdapter } from './local';

export function getStorageAdapter(): StorageAdapter {
  // Can be configured to route to MinIO, R2, S3, etc. based on ENV vars later
  if (process.env.STORAGE_PROVIDER === 'vercel-blob' || process.env.BLOB_READ_WRITE_TOKEN) {
    return new VercelBlobAdapter();
  }
  return new LocalStorageAdapter();
}

export const storage = getStorageAdapter();

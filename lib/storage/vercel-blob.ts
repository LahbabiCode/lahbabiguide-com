import { put, del } from '@vercel/blob';
import { StorageAdapter } from './types';

export class VercelBlobAdapter implements StorageAdapter {
  async uploadFile(file: File, prefix: string = '') {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not set, falling back to dummy url');
      return `https://dummy-blob.com/${file.name}`;
    }
    const filename = prefix ? `${prefix}/${file.name}` : file.name;
    const blob = await put(filename, file, { access: 'public' });
    return blob.url;
  }

  async deleteFile(url: string) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not set, skipping delete');
      return;
    }
    await del(url);
  }
}

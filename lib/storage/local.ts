import { StorageAdapter } from './types';
import fs from 'fs';
import path from 'path';

export class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      try { fs.mkdirSync(this.uploadDir, { recursive: true }); } catch (e) {}
    }
  }

  async uploadFile(file: File, prefix: string = '') {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
    const targetDir = prefix ? path.join(this.uploadDir, prefix) : this.uploadDir;
    
    if (!fs.existsSync(targetDir)) {
      try { fs.mkdirSync(targetDir, { recursive: true }); } catch (e) {}
    }

    const targetPath = path.join(targetDir, uniqueFilename);
    try {
        fs.writeFileSync(targetPath, buffer);
    } catch(e) {
        console.error("Local upload failed", e);
        return `/placeholder.png`;
    }
    
    return `/uploads/${prefix ? prefix + '/' : ''}${uniqueFilename}`;
  }

  async deleteFile(url: string) {
    if (url.startsWith('/uploads/')) {
      const relativePath = url.replace('/uploads/', '');
      const targetPath = path.join(this.uploadDir, relativePath);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
    }
  }
}

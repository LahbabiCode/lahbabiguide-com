"use server";

import { storage } from '@/lib/storage';
import { prisma } from '@/lib/db/prisma';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

export async function uploadMedia(data: FormData) {
  await requireAdmin();
  try {
    const file = data.get('file') as File;
    const prefix = data.get('prefix') as string || '';
    const altText = data.get('altText') as string || null;
    const title = data.get('title') as string || null;
    const usageTarget = data.get('usageTarget') as string || null;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const url = await storage.uploadFile(file, prefix);

    const media = await prisma.mediaFile.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        sizeBytes: file.size,
        altText,
        title,
        usageTarget,
      }
    });

    revalidateTag('media');
    return { success: true, media };
  } catch (error) {
    console.error("Media upload error:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  try {
    const media = await prisma.mediaFile.findUnique({ where: { id } });
    if (!media) return { success: false, error: 'Not found' };

    await storage.deleteFile(media.url);
    await prisma.mediaFile.delete({ where: { id } });

    revalidateTag('media');
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getMediaFiles() {
  await requireAdmin();
  return prisma.mediaFile.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

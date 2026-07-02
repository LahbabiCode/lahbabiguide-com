"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

export async function updateAdPlacements(ads: any[]) {
  await requireAdmin();
  try {
    for (const ad of ads) {
      await prisma.adPlacement.upsert({
        where: { key: ad.key },
        update: {
          name: ad.name,
          slotId: ad.slotId,
          format: ad.format,
          layoutKey: ad.layoutKey || null,
          enabled: ad.enabled,
        },
        create: {
          key: ad.key,
          name: ad.name,
          slotId: ad.slotId,
          format: ad.format,
          layoutKey: ad.layoutKey || null,
          enabled: ad.enabled,
        },
      });
    }

    revalidateTag("ads");
    return { success: true };
  } catch (error) {
    console.error("Failed to update ads:", error);
    return { success: false, error: String(error) };
  }
}

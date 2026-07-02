"use server";

import { prisma } from "@/lib/db/prisma";
import { processRegeneration, RegenerationType } from "@/lib/ahosti/engine";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

export async function handleRegeneration(projectId: string, type: RegenerationType, targetPath?: string) {
  await requireAdmin();
  try {
    await processRegeneration(projectId, type, targetPath);
    revalidatePath("/admin/autonomous");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function handleCreateDemo() {
  await requireAdmin();
  const { createProjectFromWizard } = await import("@/lib/ahosti/engine");
  const p = await createProjectFromWizard("LahbabiGuide Core", "The main platform infrastructure and content engine.");
  
  // Create some initial files with various statuses to demonstrate the system
  await prisma.generatedFile.createMany({
    data: [
      { projectId: p.id, path: "/app/layout.tsx", type: "framework", status: "generated" },
      { projectId: p.id, path: "/lib/blueprint.json", type: "blueprint", status: "pending" },
      { projectId: p.id, path: "/.vscode/settings.json", type: "ide", status: "failed", error: "IO Timeout during transmission" },
      { projectId: p.id, path: "/docs/ENGINE.md", type: "document", status: "incomplete", error: "Stream interrupted at 85%" },
      { projectId: p.id, path: "/lib/gemini.ts", type: "agent", status: "pending" },
      { projectId: p.id, path: "/app/api/tasks/route.ts", type: "taskboard", status: "validated" },
      { projectId: p.id, path: "/app/messages/welcome.ts", type: "message", status: "generated" },
    ]
  });

  revalidatePath("/admin/autonomous");
  return { success: true };
}

export async function getProjectsWithStats() {
  await requireAdmin();
  const projects = await prisma.project.findMany({
    include: {
      files: true,
      runs: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  return projects.map((p: { id: string; files: { status: string; path: string; error: string | null }[] }) => {
    const missingFiles = p.files.filter((f: { status: string }) => ["pending", "failed", "incomplete"].includes(f.status));
    return {
      ...p,
      missingCount: missingFiles.length,
      missingNames: missingFiles.map((f: { path: string }) => f.path),
      isComplete: p.files.length > 0 && missingFiles.length === 0,
      validationErrors: p.files
        .filter((f: { status: string }) => f.status === "failed")
        .map((f: { path: string; error: string | null }) => `${f.path}: ${f.error || "Unknown error"}`)
    };
  });
}

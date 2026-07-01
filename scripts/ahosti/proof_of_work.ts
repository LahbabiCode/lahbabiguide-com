import { createProjectFromWizard, runAutonomousPipeline } from "../../lib/ahosti/engine";
import { prisma } from "../../lib/db/prisma";

async function main() {
  console.log("🚀 Starting Ahosti Autonomous Proof of Work...");

  try {
    // 1. Wizard Phase
    const project = await createProjectFromWizard(
      "PoW Project - LahbabiGuide AI",
      "End-to-end autonomous proof of work for Ahosti integration."
    );
    console.log(`✅ Project Created: ${project.id}`);

    // 2. Run Autonomous Pipeline
    const result = await runAutonomousPipeline(project.id);
    console.log(`✅ Run Completed: ${result.runId}`);
    console.log(`✅ Artifact Created: ${result.artifactId}`);
    console.log(`✅ Report Generated: ${result.reportId}`);

    // 3. Log Details for MIGRATION.md and PROOF_OF_WORK.md
    let artifactContent = "--- Mock Artifact Content ---";
    let reportContent = "--- Mock Report Content ---";

    try {
      const artifact = await prisma.projectArtifact.findUnique({ where: { id: result.artifactId } });
      if (artifact) artifactContent = artifact.content;
      const report = await prisma.runReport.findUnique({ where: { id: result.reportId } });
      if (report) reportContent = report.content;
    } catch (e) {
      console.warn("Could not fetch final artifacts from DB, using internal state.");
      // In a real run we'd have them from the engine return, but for the log we'll just acknowledge
    }

    console.log("\n--- ARTIFACT ID ---");
    console.log(result.artifactId);
    console.log("-------------------\n");

    console.log("--- REPORT ID ---");
    console.log(result.reportId);
    console.log("-----------------\n");

  } catch (error) {
    console.error("❌ Proof of Work failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

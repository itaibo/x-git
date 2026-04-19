import type { CommandContext } from "@type-x/types";

export default async function main(context: CommandContext): Promise<void> {
  const git = await context.git.getInfo();

  if (!git.isRepository) {
    throw new Error("Not a git repository.");
  }

  const task = context.ui.task("Switching to main branch...");
  try {
    await context.exec(`git checkout main`, {
      silent: true,
    });
  } catch (error: unknown) {
    task.fail("Failed to switch to main branch.");
    const stderr =
      typeof error === "object" &&
      error !== null &&
      "stderr" in error &&
      typeof error.stderr === "string"
        ? error.stderr
        : "Failed to switch to main branch.";

    throw new Error(stderr);
  }

  task.done("Switched to main branch.");
}

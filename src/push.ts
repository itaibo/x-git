import type { CommandContext } from "@type-x/types";

export default async function push(context: CommandContext): Promise<void> {
  const git = await context.git.getInfo();

  if (!git.isRepository) {
    throw new Error("Not a git repository.");
  }

  const branch = git.branch;

  if (!branch) {
    throw new Error("No branch found.");
  }

  const task = context.ui.task("Pushing changes...");

  try {
    await context.exec(`git push origin ${branch}`, {
      silent: true,
    });
  } catch (error) {
    task.fail("Failed to push changes.");
    throw new Error(error as string);
  }

  task.done("Changes pushed successfully.");
}

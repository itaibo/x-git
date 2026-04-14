import type { CommandContext } from "@type-x/types";

export default async function pull(context: CommandContext): Promise<void> {
  const git = await context.git.getInfo();

  if (!git.isRepository) {
    throw new Error("Not a git repository.");
  }

  const branch = git.branch;

  if (!branch) {
    throw new Error("No branch found.");
  }

  const task = context.ui.task("Pulling changes...");

  try {
    await context.exec(
      `git pull origin ${branch} ${context.request.flags.r ? "--rebase" : ""}`.trim(),
      { silent: true },
    );
  } catch (error) {
    task.fail("Failed to pull changes.");
    throw new Error(error as string);
  }

  task.done("Changes pulled successfully.");
}

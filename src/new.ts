import type { CommandContext } from "@type-x/types";

export default async function newBranch(
  context: CommandContext,
): Promise<void> {
  const git = await context.git.getInfo();

  if (!git.isRepository) {
    throw new Error("Not a git repository.");
  }

  const currentBranch = git.branch;

  if (!currentBranch) {
    throw new Error("No branch found.");
  }

  const newBranch = context.request.args[0];

  if (!newBranch) {
    throw new Error("No branch name provided.");
  }

  const branchName =
    newBranch.includes("/") || context.request.flags.bare
      ? newBranch
      : `feature/${newBranch}`;

  const task = context.ui.task(`Creating ${branchName} branch...`);

  try {
    await context.exec(
      `git checkout -b ${branchName} origin/${currentBranch}`,
      { silent: true },
    );
  } catch (error) {
    task.fail(`Failed to create ${branchName} branch.`);
    throw new Error(error as string);
  }

  task.done(`Branch ${branchName} created successfully.`);
}

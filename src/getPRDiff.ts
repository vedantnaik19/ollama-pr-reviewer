import { Octokit } from "@octokit/rest";
import { context } from "@actions/github";

export async function getPRDiff(): Promise<string[]> {
  const token = process.env.GITHUB_TOKEN;
  const octokit = new Octokit({
    auth: token
  });

  const { owner, repo } = context.repo;
  const pull_number = context.payload.pull_request?.number;

  if (!pull_number) {
    throw new Error("Pull request number not found in context");
  }

  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number,
    mediaType: {
      format: "diff"
    }
  });
  // TODO: Filter file mechanism
  // Discard large diffs for now
  const filteredFiles = files.filter(file => {
    const str = JSON.stringify(file?.patch ?? {});
    return str.length > 0 && str.length <= 5000;
  });

  const modFiles = filteredFiles.map(
    file =>
      `File Name: ${file.filename}\nStatus: ${file.status}${file.patch ? `\nGit Diff:\n${file.patch}` : ""}`
  );

  return modFiles;
}

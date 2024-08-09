import { getInput, setOutput, setFailed } from "@actions/core";
import { readFile } from "fs/promises";
import fetch from 'node-fetch';
import pLimit from "p-limit";

(async () => {
  try {
    const concurrency = parseInt(getInput("concurrency"));
    const filePath = getInput("git_diff_file_path");
    const prompt = getInput("prompt");
    const model = getInput("model");

    const content = await readFile(filePath, "utf8");

    const parts = content.split(/(?=diff --git )/);

    const countLines = (text) => text.split("\n").length;

    const maxLines = 200;
    const filteredParts = parts.filter((part) => countLines(part) <= maxLines);

    console.log(filteredParts.length);

    const limit = pLimit(concurrency);

    const promises = filteredParts.map((part) =>
      limit(() => postData(model, part, prompt))
    );

    const results = await Promise.all(promises);

    const combinedResult = results.reduce((acc, result) => {
      return acc + result.response + "\n\n";
    }, "");

    console.log(combinedResult);  
    setOutput("review", combinedResult);
  } catch (error) {
    console.error(error);  
    setFailed(error.message);
  }
})();

async function postData(model, content, prompt) {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stream: false,
      model,
      prompt: `${prompt}:\n\n${content}`,
    }),
  });
  return response.json();
}

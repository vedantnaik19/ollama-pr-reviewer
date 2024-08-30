import { Ollama } from "@langchain/ollama";

export async function generateReview(
  model: string,
  baseUrl: string,
  prompt: string,
  fileDiffs: string[]
): Promise<void> {
  const ollama = new Ollama({
    baseUrl,
    model,
    temperature: 0
  });

  fileDiffs.forEach(async fileDiff => {
    const stream = await ollama.stream(`${prompt}\n${fileDiff}`);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    console.log(chunks.join(""));
  });
}

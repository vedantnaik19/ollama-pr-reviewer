import { generateReview } from "./generateReview";
import { getInputs, Inputs } from "./getInputs";
import { getPRDiff } from "./getPRDiff";

async function run() {
  try {
    const { model, baseUrl, prompt }: Inputs = getInputs();
    const fileDiffs = await getPRDiff();

    await generateReview(model, baseUrl, prompt, fileDiffs);
  } catch (e) {
    console.log(e);
  }
}

run();

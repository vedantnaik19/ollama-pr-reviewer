import { generateReview } from "./generateReview";
import { getInputs, Inputs } from "./getInputs";
import { getPRDiff } from "./getPRDiff";

async function run() {
  try {
    const { model, baseUrl, prompt }: Inputs = getInputs();
    const fileDiffs = await getPRDiff();

    const review = await generateReview(model, baseUrl, prompt, fileDiffs);
    console.log(review);
  } catch (e) {
    console.log(e);
  }
}

run();

import { getInput } from "@actions/core";

export interface Inputs {
  model: string;
  baseUrl: string;
  prompt: string;
}

export function getInputs(): Inputs {
  const model: string = getInput("model");
  const baseUrl: string = getInput("base-url");
  const prompt: string = getInput("prompt");
  return { model, baseUrl, prompt } as Inputs;
}

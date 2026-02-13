import { bookNlpModels } from "./models/index.js";

const trimOutput = (output) => {
  if (output === null || output === undefined) return null;
  if (Array.isArray(output)) return output.slice(0, 3);
  if (typeof output === "object") return output;
  return output;
};

export const runNlpOrchestration = async ({ query, intent, topBooks }) => {
  const prompt = [
    `Query: ${query || ""}`,
    `Intent: ${intent.intent}`,
    `Top books: ${(topBooks || []).slice(0, 4).map((b) => b.volumeInfo?.title).filter(Boolean).join(", ")}`,
  ].join("\n");

  const runs = await Promise.all(
    bookNlpModels.map(async (model) => {
      const result = await model.run(prompt, { intent, topBooks });
      return {
        id: model.id,
        task: model.task,
        model: model.model,
        enabled: result.enabled,
        reason: result.reason,
        output: trimOutput(result.output),
      };
    })
  );

  return {
    modelCount: bookNlpModels.length,
    activeCount: runs.filter((r) => r.enabled && !r.reason).length,
    models: runs,
  };
};

export const runSelectedModels = async ({ modelIds, prompt, context = {} }) => {
  const selected = new Set(modelIds || []);
  const models = bookNlpModels.filter((model) => selected.has(model.id));

  const runs = await Promise.all(
    models.map(async (model) => {
      const result = await model.run(prompt, context);
      return {
        id: model.id,
        task: model.task,
        model: model.model,
        enabled: result.enabled,
        reason: result.reason,
        output: trimOutput(result.output),
      };
    })
  );

  return {
    requestedModelCount: selected.size,
    executedModelCount: runs.length,
    activeCount: runs.filter((r) => r.enabled && !r.reason).length,
    models: runs,
  };
};

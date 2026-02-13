const pipelineCache = new Map();

const canUseLocalNlp = () => process.env.ENABLE_LOCAL_NLP === "true";

export const loadPipeline = async (task, model) => {
  const key = `${task}:${model}`;
  if (pipelineCache.has(key)) {
    return pipelineCache.get(key);
  }

  const loader = (async () => {
    const { pipeline } = await import("@xenova/transformers");
    return pipeline(task, model);
  })();

  pipelineCache.set(key, loader);
  return loader;
};

export const runModelSafely = async ({ id, task, model, input, options }) => {
  if (!canUseLocalNlp()) {
    return {
      id,
      task,
      model,
      enabled: false,
      output: null,
      reason: "Local NLP disabled. Set ENABLE_LOCAL_NLP=true to run transformers locally.",
    };
  }

  try {
    const pipe = await loadPipeline(task, model);
    const output = await pipe(input, options || {});
    return {
      id,
      task,
      model,
      enabled: true,
      output,
      reason: null,
    };
  } catch (err) {
    return {
      id,
      task,
      model,
      enabled: true,
      output: null,
      reason: err?.message || "Model execution failed",
    };
  }
};

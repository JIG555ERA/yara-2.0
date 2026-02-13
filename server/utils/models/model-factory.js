import { runModelSafely } from "./model-runtime.js";

export const createModel = ({ id, task, model, optionsBuilder }) => ({
  id,
  task,
  model,
  async run(input, context = {}) {
    const options = optionsBuilder ? optionsBuilder(context) : {};
    return runModelSafely({ id, task, model, input, options });
  },
});

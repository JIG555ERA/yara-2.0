import { createModel } from "./model-factory.js";

const queryExpanderModel = createModel({
  id: "query_expander",
  task: "text2text-generation",
  model: "Xenova/flan-t5-small",
  optionsBuilder: () => ({
    max_new_tokens: 96,
  }),
});

export default queryExpanderModel;

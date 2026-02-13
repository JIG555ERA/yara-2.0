import { createModel } from "./model-factory.js";

const recommendationReasonerModel = createModel({
  id: "recommendation_reasoner",
  task: "text2text-generation",
  model: "Xenova/flan-t5-small",
  optionsBuilder: () => ({
    max_new_tokens: 96,
  }),
});

export default recommendationReasonerModel;

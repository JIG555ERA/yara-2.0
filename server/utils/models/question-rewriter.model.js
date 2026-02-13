import { createModel } from "./model-factory.js";

const questionRewriterModel = createModel({
  id: "question_rewriter",
  task: "text2text-generation",
  model: "Xenova/flan-t5-small",
  optionsBuilder: () => ({
    max_new_tokens: 72,
  }),
});

export default questionRewriterModel;

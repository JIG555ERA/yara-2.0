import { createModel } from "./model-factory.js";

const answerComposerModel = createModel({
  id: "answer_composer",
  task: "text2text-generation",
  model: "Xenova/flan-t5-small",
  optionsBuilder: () => ({
    max_new_tokens: 120,
  }),
});

export default answerComposerModel;

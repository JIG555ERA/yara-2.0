import { createModel } from "./model-factory.js";

const summarizerModel = createModel({
  id: "summarizer",
  task: "summarization",
  model: "Xenova/distilbart-cnn-6-6",
  optionsBuilder: () => ({
    max_new_tokens: 90,
  }),
});

export default summarizerModel;

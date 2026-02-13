import { createModel } from "./model-factory.js";

const keywordExtractorModel = createModel({
  id: "keyword_extractor",
  task: "token-classification",
  model: "Xenova/bert-base-NER",
  optionsBuilder: () => ({
    ignore_labels: ["O"],
  }),
});

export default keywordExtractorModel;

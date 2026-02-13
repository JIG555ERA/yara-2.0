import { createModel } from "./model-factory.js";

const intentClassifierModel = createModel({
  id: "intent_classifier",
  task: "zero-shot-classification",
  model: "Xenova/distilbert-base-uncased-mnli",
  optionsBuilder: () => ({
    candidate_labels: [
      "title prefix query",
      "title suffix query",
      "author lookup",
      "publisher lookup",
      "year lookup",
      "general search",
    ],
    multi_label: false,
  }),
});

export default intentClassifierModel;

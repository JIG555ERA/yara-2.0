import { createModel } from "./model-factory.js";

const rerankerEvaluatorModel = createModel({
  id: "reranker_evaluator",
  task: "zero-shot-classification",
  model: "Xenova/distilbert-base-uncased-mnli",
  optionsBuilder: () => ({
    candidate_labels: [
      "high relevance",
      "medium relevance",
      "low relevance",
      "poor match",
    ],
    multi_label: false,
  }),
});

export default rerankerEvaluatorModel;

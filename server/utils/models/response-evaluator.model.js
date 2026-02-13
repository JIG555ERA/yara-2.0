import { createModel } from "./model-factory.js";

const responseEvaluatorModel = createModel({
  id: "response_evaluator",
  task: "zero-shot-classification",
  model: "Xenova/distilbert-base-uncased-mnli",
  optionsBuilder: () => ({
    candidate_labels: [
      "answer fully satisfies user query",
      "answer partially satisfies user query",
      "answer does not satisfy user query",
    ],
    multi_label: false,
  }),
});

export default responseEvaluatorModel;

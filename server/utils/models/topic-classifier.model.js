import { createModel } from "./model-factory.js";

const topicClassifierModel = createModel({
  id: "topic_classifier",
  task: "zero-shot-classification",
  model: "Xenova/distilbert-base-uncased-mnli",
  optionsBuilder: () => ({
    candidate_labels: [
      "fiction",
      "non-fiction",
      "education",
      "business",
      "science",
      "history",
      "children",
    ],
    multi_label: true,
  }),
});

export default topicClassifierModel;

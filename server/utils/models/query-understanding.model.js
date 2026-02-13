import { createModel } from "./model-factory.js";

const queryUnderstandingModel = createModel({
  id: "query_understanding",
  task: "zero-shot-classification",
  model: "Xenova/distilbert-base-uncased-mnli",
  optionsBuilder: () => ({
    candidate_labels: [
      "book title lookup",
      "author discovery",
      "publisher discovery",
      "year based filtering",
      "descriptive semantic search",
      "takeaway extraction",
    ],
    multi_label: true,
  }),
});

export default queryUnderstandingModel;

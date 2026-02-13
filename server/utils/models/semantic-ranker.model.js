import { createModel } from "./model-factory.js";

const semanticRankerModel = createModel({
  id: "semantic_ranker",
  task: "feature-extraction",
  model: "Xenova/all-MiniLM-L6-v2",
});

export default semanticRankerModel;

import { createModel } from "./model-factory.js";

const descriptionMatcherModel = createModel({
  id: "description_matcher",
  task: "feature-extraction",
  model: "Xenova/all-MiniLM-L6-v2",
});

export default descriptionMatcherModel;

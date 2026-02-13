import { createModel } from "./model-factory.js";

const titleMatcherModel = createModel({
  id: "title_matcher",
  task: "feature-extraction",
  model: "Xenova/all-MiniLM-L6-v2",
});

export default titleMatcherModel;

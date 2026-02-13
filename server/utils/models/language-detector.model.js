import { createModel } from "./model-factory.js";

const languageDetectorModel = createModel({
  id: "language_detector",
  task: "text-classification",
  model: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
});

export default languageDetectorModel;

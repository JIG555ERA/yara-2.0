import { createModel } from "./model-factory.js";

const entityLinkerModel = createModel({
  id: "entity_linker",
  task: "token-classification",
  model: "Xenova/bert-base-NER",
  optionsBuilder: () => ({
    ignore_labels: ["O"],
  }),
});

export default entityLinkerModel;

import { createModel } from "./model-factory.js";

const takeawayGeneratorModel = createModel({
  id: "takeaway_generator",
  task: "text2text-generation",
  model: "Xenova/flan-t5-small",
  optionsBuilder: () => ({
    max_new_tokens: 140,
  }),
});

export default takeawayGeneratorModel;

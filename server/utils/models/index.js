import intentClassifierModel from "./intent-classifier.model.js";
import keywordExtractorModel from "./keyword-extractor.model.js";
import semanticRankerModel from "./semantic-ranker.model.js";
import questionRewriterModel from "./question-rewriter.model.js";
import queryExpanderModel from "./query-expander.model.js";
import summarizerModel from "./summarizer.model.js";
import answerComposerModel from "./answer-composer.model.js";
import titleMatcherModel from "./title-matcher.model.js";
import languageDetectorModel from "./language-detector.model.js";
import topicClassifierModel from "./topic-classifier.model.js";
import entityLinkerModel from "./entity-linker.model.js";
import recommendationReasonerModel from "./recommendation-reasoner.model.js";
import takeawayGeneratorModel from "./takeaway-generator.model.js";
import descriptionMatcherModel from "./description-matcher.model.js";
import rerankerEvaluatorModel from "./reranker-evaluator.model.js";
import queryUnderstandingModel from "./query-understanding.model.js";
import responseEvaluatorModel from "./response-evaluator.model.js";

export const bookNlpModels = [
  intentClassifierModel,
  keywordExtractorModel,
  semanticRankerModel,
  questionRewriterModel,
  queryExpanderModel,
  summarizerModel,
  answerComposerModel,
  titleMatcherModel,
  languageDetectorModel,
  topicClassifierModel,
  entityLinkerModel,
  recommendationReasonerModel,
  takeawayGeneratorModel,
  descriptionMatcherModel,
  rerankerEvaluatorModel,
  queryUnderstandingModel,
  responseEvaluatorModel,
];

export const executionPlans = {
  book_recommendation: { models: ["semantic_ranker", "recommendation_reasoner"], sources: ["google_books", "open_library", "wikipedia"] },
  genre_search: { models: ["intent_classifier", "topic_classifier"], sources: ["google_books", "open_library"] },
  mood_based: { models: ["topic_classifier", "recommendation_reasoner"], sources: ["google_books", "wikipedia"] },
  age_based: { models: ["intent_classifier"], sources: ["google_books", "open_library"] },
  country_specific: { models: ["entity_linker"], sources: ["open_library", "wikipedia"] },
  bestseller: { models: ["query_expander"], sources: ["google_books"] },
  reading_level: { models: ["question_rewriter"], sources: ["open_library", "google_books"] },
  language_specific: { models: ["language_detector"], sources: ["google_books", "open_library"] },
  series_discovery: { models: ["semantic_ranker"], sources: ["google_books", "open_library"] },

  book_summary: { models: ["summarizer"], sources: ["google_books", "wikipedia", "gutenberg"] },
  chapter_summary: { models: ["summarizer"], sources: ["gutenberg"] },
  key_ideas: { models: ["takeaway_generator"], sources: ["google_books", "wikipedia", "gutenberg"] },
  quote_extraction: { models: ["keyword_extractor"], sources: ["gutenberg"] },
  character_analysis: { models: ["topic_classifier"], sources: ["gutenberg", "wikipedia"] },
  theme_analysis: { models: ["topic_classifier"], sources: ["gutenberg"] },
  symbolism: { models: ["topic_classifier"], sources: ["gutenberg", "wikipedia"] },
  moral_lesson: { models: ["answer_composer"], sources: ["gutenberg", "wikipedia"] },
  ending_explanation: { models: ["answer_composer"], sources: ["gutenberg"] },

  book_to_notes: { models: ["summarizer"], sources: ["gutenberg", "google_books"] },
  mcq_generation: { models: ["answer_composer"], sources: ["gutenberg"] },
  question_answering: { models: ["intent_classifier", "answer_composer"], sources: ["google_books", "wikipedia", "gutenberg"] },
  vocabulary_learning: { models: ["keyword_extractor"], sources: ["wordnet", "google_books"] },
  book_comparison: { models: ["semantic_ranker", "reranker_evaluator"], sources: ["google_books", "open_library"] },
  revision_summary: { models: ["summarizer"], sources: ["gutenberg", "google_books"] },
  concept_explanation: { models: ["question_rewriter", "answer_composer"], sources: ["google_books", "wikipedia"] },

  rewrite: { models: ["question_rewriter"], sources: ["google_books"] },
  continue_story: { models: ["answer_composer"], sources: ["gutenberg"] },
  adapt_screenplay: { models: ["answer_composer"], sources: ["gutenberg"] },
  tone_change: { models: ["question_rewriter"], sources: ["google_books"] },
  flashcards: { models: ["answer_composer"], sources: ["gutenberg", "google_books"] },
  audiobook_script: { models: ["answer_composer"], sources: ["gutenberg"] },

  author_background: { models: ["entity_linker"], sources: ["wikipedia", "open_library"] },
  historical_context: { models: ["entity_linker"], sources: ["wikipedia", "open_library"] },
  book_impact: { models: ["topic_classifier"], sources: ["wikipedia"] },
  similar_authors: { models: ["semantic_ranker"], sources: ["wikipedia", "open_library"] },
  publication_info: { models: ["intent_classifier"], sources: ["open_library", "google_books"] },
  awards_info: { models: ["entity_linker"], sources: ["wikipedia"] },
};

export const getExecutionPlan = (queryType) => {
  return executionPlans[queryType] || executionPlans.book_recommendation;
};

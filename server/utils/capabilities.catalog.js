export const booksAiCapabilities = {
  generatedAt: new Date().toISOString(),
  groups: [
    {
      id: "content_discovery",
      name: "Content Discovery & Recommendation",
      intents: [
        { type: "book_recommendation", models: ["BERT", "SBERT", "T5"], sources: ["Open Library", "Google Books"] },
        { type: "genre_search", models: ["BERT", "DistilBERT"], sources: ["Open Library", "Goodreads"] },
        { type: "mood_based", models: ["RoBERTa"], sources: ["Goodreads", "Reddit datasets"] },
        { type: "age_based", models: ["BERT"], sources: ["Open Library"] },
        { type: "country_specific", models: ["BERT"], sources: ["Open Library", "Wikipedia"] },
        { type: "bestseller", models: ["T5"], sources: ["Google Books"] },
        { type: "reading_level", models: ["DistilBERT"], sources: ["Open Library"] },
        { type: "language_specific", models: ["mBERT", "XLM-R"], sources: ["Open Library"] },
        { type: "series_discovery", models: ["BERT"], sources: ["Open Library"] }
      ]
    },
    {
      id: "book_analysis",
      name: "Book Understanding & Analysis",
      intents: [
        { type: "book_summary", models: ["BART", "T5"], sources: ["Project Gutenberg", "Wikipedia", "Google Books"] },
        { type: "chapter_summary", models: ["Long-T5"], sources: ["Project Gutenberg"] },
        { type: "key_ideas", models: ["BERT", "KeyBERT"], sources: ["Project Gutenberg", "Google Books"] },
        { type: "quote_extraction", models: ["BERT"], sources: ["Project Gutenberg"] },
        { type: "character_analysis", models: ["RoBERTa"], sources: ["Project Gutenberg", "Wikipedia"] },
        { type: "theme_analysis", models: ["BERT"], sources: ["Project Gutenberg"] },
        { type: "symbolism", models: ["RoBERTa"], sources: ["Literary datasets"] },
        { type: "moral_lesson", models: ["T5"], sources: ["Project Gutenberg"] },
        { type: "ending_explanation", models: ["BERT"], sources: ["Project Gutenberg"] }
      ]
    },
    {
      id: "study_learning",
      name: "Learning, Exam & Study",
      intents: [
        { type: "book_to_notes", models: ["Pegasus"], sources: ["Project Gutenberg"] },
        { type: "mcq_generation", models: ["T5"], sources: ["Project Gutenberg"] },
        { type: "question_answering", models: ["BERT-QA"], sources: ["Project Gutenberg"] },
        { type: "vocabulary_learning", models: ["BERT"], sources: ["WordNet"] },
        { type: "book_comparison", models: ["BERT", "SBERT"], sources: ["Project Gutenberg"] },
        { type: "revision_summary", models: ["DistilBERT"], sources: ["Project Gutenberg"] },
        { type: "concept_explanation", models: ["T5"], sources: ["User text"] }
      ]
    },
    {
      id: "creative_transform",
      name: "Writing, Creativity & Transformation",
      intents: [
        { type: "rewrite", models: ["T5"], sources: ["User text"] },
        { type: "continue_story", models: ["GPT-style Transformer"], sources: ["Project Gutenberg"] },
        { type: "adapt_screenplay", models: ["T5"], sources: ["Project Gutenberg"] },
        { type: "tone_change", models: ["RoBERTa"], sources: ["User text"] },
        { type: "flashcards", models: ["T5"], sources: ["Project Gutenberg"] },
        { type: "audiobook_script", models: ["BART"], sources: ["Project Gutenberg"] }
      ]
    },
    {
      id: "metadata_external",
      name: "Metadata, Author & External Knowledge",
      intents: [
        { type: "author_background", models: ["BERT"], sources: ["Wikipedia"] },
        { type: "historical_context", models: ["BERT"], sources: ["Wikipedia"] },
        { type: "book_impact", models: ["RoBERTa"], sources: ["Wikipedia"] },
        { type: "similar_authors", models: ["SBERT"], sources: ["Wikipedia"] },
        { type: "publication_info", models: ["BERT"], sources: ["Open Library"] },
        { type: "awards_info", models: ["BERT"], sources: ["Wikipedia"] }
      ]
    }
  ],
  dataSources: [
    "Project Gutenberg",
    "Open Library",
    "Google Books API",
    "Wikipedia",
    "Goodreads",
    "WordNet",
    "Reddit datasets",
    "Kaggle book datasets"
  ],
  suggestedStack: {
    embedding: "Sentence-BERT",
    search: ["FAISS", "Weaviate"],
    summarization: ["BART", "T5"],
    qa: "BERT fine-tuned on SQuAD",
    multilingual: "XLM-R"
  }
};

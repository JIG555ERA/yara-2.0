const section = (title, lines) => ({ title, lines });

const templateMap = {
  book_recommendation: { task: "text2text-generation", instruction: "Recommend books that best match the user preference and explain why each is relevant." },
  genre_search: { task: "text2text-generation", instruction: "Return strongest books in the requested genre with short evidence from metadata." },
  mood_based: { task: "text2text-generation", instruction: "Recommend books aligned to emotional tone and comfort value." },
  age_based: { task: "text2text-generation", instruction: "Suggest age-appropriate books and mention reading suitability." },
  country_specific: { task: "text2text-generation", instruction: "Prioritize books connected to the requested country or national context." },
  bestseller: { task: "text2text-generation", instruction: "Highlight highly rated and high-visibility books from available catalogs." },
  reading_level: { task: "text2text-generation", instruction: "Suggest beginner-friendly books with simple prose and approachable structure." },
  language_specific: { task: "text2text-generation", instruction: "Return books primarily in the requested language." },
  series_discovery: { task: "text2text-generation", instruction: "Find notable series and reading order hints." },

  book_summary: { task: "summarization", instruction: "Create a clear summary with overview, ideas, and reader value." },
  chapter_summary: { task: "summarization", instruction: "Summarize the requested chapter into focused study points." },
  key_ideas: { task: "text2text-generation", instruction: "Extract major ideas and practical lessons." },
  quote_extraction: { task: "text2text-generation", instruction: "Extract strong representative quotes with short context notes." },
  character_analysis: { task: "text2text-generation", instruction: "Analyze core character traits, motivations, and arc." },
  theme_analysis: { task: "text2text-generation", instruction: "Explain central themes and supporting motifs." },
  symbolism: { task: "text2text-generation", instruction: "Identify symbols and interpret literary meaning." },
  moral_lesson: { task: "text2text-generation", instruction: "State key moral and philosophical lessons." },
  ending_explanation: { task: "text2text-generation", instruction: "Explain ending logic, impact, and unresolved tension." },

  book_to_notes: { task: "text2text-generation", instruction: "Convert content to concise study notes." },
  mcq_generation: { task: "text2text-generation", instruction: "Generate objective MCQs with answers and rationale." },
  question_answering: { task: "question-answering", instruction: "Answer directly with evidence from retrieved text." },
  vocabulary_learning: { task: "text2text-generation", instruction: "Explain difficult words with simple meanings and usage." },
  book_comparison: { task: "text2text-generation", instruction: "Compare two books across themes, style, and audience." },
  revision_summary: { task: "summarization", instruction: "Create quick revision bullets for recall." },
  concept_explanation: { task: "text2text-generation", instruction: "Explain difficult concepts in plain language." },

  rewrite: { task: "text2text-generation", instruction: "Rewrite while preserving meaning and improving clarity." },
  continue_story: { task: "text2text-generation", instruction: "Continue narrative in a coherent style." },
  adapt_screenplay: { task: "text2text-generation", instruction: "Transform prose into screenplay scene format." },
  tone_change: { task: "text2text-generation", instruction: "Rewrite in requested tone while retaining facts." },
  flashcards: { task: "text2text-generation", instruction: "Generate Q/A flashcards from core ideas." },
  audiobook_script: { task: "text2text-generation", instruction: "Convert text to smooth narration-ready script." },

  author_background: { task: "text2text-generation", instruction: "Provide concise author background and milestones." },
  historical_context: { task: "text2text-generation", instruction: "Explain historical context and publication period." },
  book_impact: { task: "text2text-generation", instruction: "Describe influence, reception, and long-term impact." },
  similar_authors: { task: "text2text-generation", instruction: "Suggest authors with similar themes and style." },
  publication_info: { task: "text2text-generation", instruction: "Provide publication timeline, editions, and identifiers." },
  awards_info: { task: "text2text-generation", instruction: "List awards and nomination-related facts." },
};

const defaultTemplate = {
  task: "text2text-generation",
  instruction: "Analyze the books query and return a useful, factual, and structured response.",
};

export const resolvePromptTemplate = ({ queryType, query, title }) => {
  const base = templateMap[queryType] || defaultTemplate;

  return {
    task: base.task,
    prompt: `${base.instruction}\nQuery: ${query || ""}\nTitle hint: ${title || "unknown"}`,
    format: [
      section("Header", ["One-line answer title"]),
      section("Subheader", ["Context and interpretation"]),
      section("List", ["Actionable bullet points"]),
    ],
  };
};

export const supportedPromptTypes = Object.keys(templateMap);

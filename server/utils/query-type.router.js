export const queryTypeCatalog = {
  content_discovery: [
    "book_recommendation",
    "genre_search",
    "mood_based",
    "age_based",
    "country_specific",
    "bestseller",
    "reading_level",
    "language_specific",
    "series_discovery"
  ],
  book_analysis: [
    "book_summary",
    "chapter_summary",
    "key_ideas",
    "quote_extraction",
    "character_analysis",
    "theme_analysis",
    "symbolism",
    "moral_lesson",
    "ending_explanation"
  ],
  study_learning: [
    "book_to_notes",
    "mcq_generation",
    "question_answering",
    "vocabulary_learning",
    "book_comparison",
    "revision_summary",
    "concept_explanation"
  ],
  creative_transform: [
    "rewrite",
    "continue_story",
    "adapt_screenplay",
    "tone_change",
    "flashcards",
    "audiobook_script"
  ],
  metadata_external: [
    "author_background",
    "historical_context",
    "book_impact",
    "similar_authors",
    "publication_info",
    "awards_info"
  ],
};

const routeRules = [
  { type: "book_recommendation", re: /suggest|recommend|similar to/i },
  { type: "genre_search", re: /genre|sci[- ]?fi|romance|thriller|fantasy/i },
  { type: "mood_based", re: /feel|mood|sad|lonely|motivated|anxious/i },
  { type: "age_based", re: /teen|kid|children|young adult|beginner age/i },
  { type: "country_specific", re: /indian|american|british|country|nation/i },
  { type: "bestseller", re: /best seller|top selling|most sold/i },
  { type: "reading_level", re: /easy|simple read|reading level|beginner/i },
  { type: "language_specific", re: /hindi|english|spanish|french|language/i },
  { type: "series_discovery", re: /series|saga|trilogy/i },

  { type: "mcq_generation", re: /mcq|multiple choice|quiz/i },
  { type: "chapter_summary", re: /chapter\s+\d+|summarize chapter/i },
  { type: "book_summary", re: /summarize|summary of/i },
  { type: "key_ideas", re: /key ideas|main lessons|main ideas|key points/i },
  { type: "quote_extraction", re: /quote|best lines|famous lines/i },
  { type: "character_analysis", re: /character|personality/i },
  { type: "theme_analysis", re: /theme|core theme/i },
  { type: "symbolism", re: /symbol|symbolism/i },
  { type: "moral_lesson", re: /moral|lesson|teach/i },
  { type: "ending_explanation", re: /ending|finale|conclusion explained/i },

  { type: "book_to_notes", re: /into notes|book to notes|convert.*notes/i },
  { type: "question_answering", re: /why|what happened|who did|question answering/i },
  { type: "vocabulary_learning", re: /vocabulary|difficult words|word meaning/i },
  { type: "book_comparison", re: /compare|vs\.?/i },
  { type: "revision_summary", re: /revision|quick summary|quick notes/i },
  { type: "concept_explanation", re: /explain.*simply|explain this paragraph/i },

  { type: "rewrite", re: /rewrite|rephrase/i },
  { type: "continue_story", re: /continue.*story|next chapter|continue creatively/i },
  { type: "adapt_screenplay", re: /screenplay|script format|movie adaptation/i },
  { type: "tone_change", re: /tone|motivational|formal|casual/i },
  { type: "flashcards", re: /flashcards/i },
  { type: "audiobook_script", re: /narration|audiobook/i },

  { type: "author_background", re: /who is the author|author background|about author/i },
  { type: "historical_context", re: /when was this written|historical context|publication history/i },
  { type: "book_impact", re: /why is.*famous|impact|influence/i },
  { type: "similar_authors", re: /authors like|similar authors/i },
  { type: "publication_info", re: /first edition|publication info|edition details/i },
  { type: "awards_info", re: /award|prize|won awards/i },
];

const findGroupForType = (type) => {
  for (const [group, types] of Object.entries(queryTypeCatalog)) {
    if (types.includes(type)) return group;
  }
  return "content_discovery";
};

export const detectQueryType = (query) => {
  const value = (query || "").trim();
  if (!value) {
    return {
      queryType: "book_recommendation",
      group: "content_discovery",
      confidence: 0.4,
      matchedRule: "default",
    };
  }

  for (const rule of routeRules) {
    if (rule.re.test(value)) {
      return {
        queryType: rule.type,
        group: findGroupForType(rule.type),
        confidence: 0.86,
        matchedRule: String(rule.re),
      };
    }
  }

  return {
    queryType: "book_recommendation",
    group: "content_discovery",
    confidence: 0.55,
    matchedRule: "fallback",
  };
};

import { runModelSafely } from "./models/model-runtime.js";

const MIN_WORDS = 250;

const countWords = (text) => (text || "").trim().split(/\s+/).filter(Boolean).length;

const toSummaryText = (output) => {
  if (!output) return "";
  if (Array.isArray(output) && output[0]?.summary_text) return output[0].summary_text;
  if (Array.isArray(output) && output[0]?.generated_text) return output[0].generated_text;
  if (typeof output === "string") return output;
  return "";
};

const buildFallbackSummary = ({ query, intent, books, wikiContext }) => {
  const top = books.slice(0, 5);
  const lines = [
    `This summary is based on your query: \"${query || "book discovery"}\" and available metadata from Google Books plus Wikipedia context.`,
    `The detected intent is \"${intent.intent}\", so the response prioritizes records that satisfy this condition across title, author, publisher, publication year, and category fields where available.`,
  ];

  for (const book of top) {
    const info = book.volumeInfo || {};
    lines.push(
      `${info.title || "Unknown title"} by ${(info.authors || ["Unknown author"]).join(", ")} was published by ${
        info.publisher || "an unknown publisher"
      }${info.publishedDate ? ` in ${info.publishedDate}` : ""}. The listed categories include ${(info.categories || ["Unspecified category"]).join(", ")}.`
    );
  }

  if (wikiContext) {
    lines.push(
      `Wikipedia context adds broader interpretation: ${wikiContext.extract || "No additional encyclopedia text was found for this exact term, so the summary uses catalog-level evidence."}`
    );
  }

  lines.push(
    "From a reader perspective, these results are useful for exploring neighboring topics, comparing publication trends, identifying recurring authors and publishers, and filtering by language, region, and maturity profile. For deeper analysis, a follow-up pass can rank by semantic relevance using description fields, snippets, subject tags, and entity mentions."
  );

  lines.push(
    "If your goal is decision support, focus on records with richer metadata such as full descriptions, ratings, identifiers, and multiple category labels. Those entries generally produce stronger retrieval quality and better recommendation explanations. You can also refine by year ranges, title prefix or suffix patterns, publisher constraints, and country-specific availability signals to narrow to market-relevant results."
  );

  return lines.join(" ");
};

const enforceMinimumWords = async (baseSummary, contextText) => {
  if (countWords(baseSummary) >= MIN_WORDS) {
    return baseSummary;
  }

  const expandPrompt = [
    "Expand the following book summary to at least 250 words.",
    "Keep it factual and structured with context, insights, and practical reading takeaways.",
    `Summary: ${baseSummary}`,
    `Context: ${contextText.slice(0, 1400)}`,
  ].join("\n");

  const expanded = await runModelSafely({
    id: "summary_expander",
    task: "text2text-generation",
    model: "Xenova/flan-t5-small",
    input: expandPrompt,
    options: { max_new_tokens: 360 },
  });

  const expandedText = toSummaryText(expanded.output);
  if (countWords(expandedText) >= MIN_WORDS) {
    return expandedText;
  }

  return `${baseSummary} ${contextText}`;
};

export const buildLongSummary = async ({ query, intent, books, wikiContext }) => {
  const sourceText = [
    `Query: ${query}`,
    `Intent: ${intent.intent}`,
    ...books.slice(0, 10).map((b) => {
      const info = b.volumeInfo || {};
      return [
        `Title: ${info.title || "Unknown"}`,
        `Authors: ${(info.authors || []).join(", ")}`,
        `Publisher: ${info.publisher || "Unknown"}`,
        `Published: ${info.publishedDate || "Unknown"}`,
        `Categories: ${(info.categories || []).join(", ")}`,
        `Description: ${info.description || ""}`,
      ].join(" | ");
    }),
    `Wikipedia: ${wikiContext?.extract || ""}`,
  ].join("\n");

  const summarizerInput =
    sourceText.length > 5000 ? `${sourceText.slice(0, 5000)} ...` : sourceText;

  const summaryResult = await runModelSafely({
    id: "long_summary",
    task: "summarization",
    model: "Xenova/distilbart-cnn-6-6",
    input: summarizerInput,
    options: {
      max_new_tokens: 320,
      min_length: 220,
    },
  });

  let summary = toSummaryText(summaryResult.output);
  if (!summary) {
    summary = buildFallbackSummary({ query, intent, books, wikiContext });
  }

  const finalSummary = await enforceMinimumWords(summary, sourceText.slice(0, 2000));

  return {
    summary: finalSummary,
    words: countWords(finalSummary),
    minimumWords: MIN_WORDS,
    model: {
      id: summaryResult.id,
      task: summaryResult.task,
      model: summaryResult.model,
      enabled: summaryResult.enabled,
      reason: summaryResult.reason,
    },
    generatedAt: new Date().toISOString(),
  };
};

export const buildKeyTakeaways = async ({ query, books, wikiContext }) => {
  const top = books[0];
  const info = top?.volumeInfo || {};
  const prompt = [
    "Generate 5 concise key takeaways for this book context.",
    `Query: ${query}`,
    `Title: ${info.title || "Unknown"}`,
    `Description: ${info.description || ""}`,
    `Wikipedia: ${wikiContext?.extract || ""}`,
  ].join("\n");

  const result = await runModelSafely({
    id: "takeaways",
    task: "text2text-generation",
    model: "Xenova/flan-t5-small",
    input: prompt,
    options: { max_new_tokens: 180 },
  });

  const text = toSummaryText(result.output);
  const list = text
    ? text
        .split(/\n|\d+\.|-/)
        .map((x) => x.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];

  const fallback = [
    `Core themes in ${info.title || "this title"} can be inferred from its catalog description and subject labels.`,
    "Look for the central conflict or problem statement described in the synopsis.",
    "Trace how the author builds arguments or narrative progression chapter by chapter.",
    "Evaluate recurring motifs, decisions, and outcomes tied to the main characters or ideas.",
    "Relate the book's practical lessons to modern reader goals such as learning, strategy, or personal growth.",
  ];

  return {
    items: list.length ? list : fallback,
    model: {
      id: result.id,
      task: result.task,
      model: result.model,
      enabled: result.enabled,
      reason: result.reason,
    },
    generatedAt: new Date().toISOString(),
  };
};

import { searchVolumes, getVolumeById } from "./clients/google-books.client.js";
import { getWikipediaSummary } from "./clients/wikipedia.client.js";
import { parseQueryIntent } from "./query-intent.parser.js";
import { applyBookFilters } from "./book-filter.engine.js";
import { normalizeVolume, normalizeVolumes } from "./book-normalizer.js";
import { formatHumanizedAnswer } from "./answer-formatter.js";
import { buildSuggestions } from "./suggestion-builder.js";
import { runNlpOrchestration } from "./nlp-orchestrator.js";
import { buildLongSummary, buildKeyTakeaways } from "./summary-builder.js";

const clamp = (value, min, max, fallback) => {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};

const fetchPages = async ({ query, startIndex, maxResults }) => {
  const requested = clamp(maxResults, 1, 120, 30);
  const pageSize = 40;
  const pages = Math.ceil(requested / pageSize);

  const requests = [];
  for (let i = 0; i < pages; i += 1) {
    requests.push(
      searchVolumes({
        query,
        startIndex: startIndex + i * pageSize,
        maxResults: Math.min(pageSize, requested - i * pageSize),
      })
    );
  }

  const responses = await Promise.all(requests);
  const totalItems = responses[0]?.totalItems || 0;
  const items = responses.flatMap((resp) => resp?.items || []);

  return { totalItems, items };
};

const enrichWithWikipedia = async (items) => {
  const limit = 8;
  const selected = items.slice(0, limit);

  const wikiEntries = await Promise.all(
    selected.map(async (item) => {
      const title = item?.volumeInfo?.title;
      const summary = await getWikipediaSummary(title);
      return [item?.id, summary];
    })
  );

  return new Map(wikiEntries.filter(([id]) => Boolean(id)));
};

const pickPrimaryWikiContext = (normalizedBooks) => {
  return normalizedBooks.find((b) => b?.volumeInfo?.wikipedia)?.volumeInfo?.wikipedia || null;
};

export const booksSearchService = async ({
  query,
  startIndex = 0,
  maxResults = 30,
  userIntentOnly = true,
  mode = "ask",
  volumeId,
}) => {
  if (mode === "volume" && volumeId) {
    const volume = await getVolumeById(volumeId);
    const wiki = await getWikipediaSummary(volume?.volumeInfo?.title);
    const normalized = normalizeVolume(volume, wiki);

    return {
      ok: true,
      mode,
      query,
      timestamp: new Date().toISOString(),
      data: normalized,
      response: {
        header: `Book detail: ${normalized.volumeInfo?.title || volumeId}`,
        subheader: "Detailed volume payload from Google Books enriched with Wikipedia.",
        list: [
          `Author(s): ${(normalized.volumeInfo?.authors || []).join(", ") || "Unknown"}`,
          `Publisher: ${normalized.volumeInfo?.publisher || "Unknown"}`,
          `Published: ${normalized.volumeInfo?.publishedDate || "Unknown"}`,
        ],
      },
      suggestions: [
        "Find more books by this author",
        "Find books from the same publisher",
        "Ask for books in similar genres",
      ],
    };
  }

  const intent = parseQueryIntent(query);
  const effectiveGoogleQuery = userIntentOnly ? intent.googleQuery : query || intent.googleQuery;

  const { totalItems, items } = await fetchPages({
    query: effectiveGoogleQuery,
    startIndex: clamp(startIndex, 0, 1000, 0),
    maxResults,
  });

  const filtered = applyBookFilters(items, intent);
  const wikiMap = await enrichWithWikipedia(filtered);
  const normalizedBooks = normalizeVolumes(filtered, wikiMap);
  const primaryWikiContext = pickPrimaryWikiContext(normalizedBooks);

  const answer = formatHumanizedAnswer({
    query,
    intent,
    books: normalizedBooks,
    totalItems,
  });

  const modelSignals = await runNlpOrchestration({
    query,
    intent,
    topBooks: normalizedBooks,
  });

  const longSummary = await buildLongSummary({
    query,
    intent,
    books: normalizedBooks,
    wikiContext: primaryWikiContext,
  });

  const keyTakeaways =
    intent.intent === "key_takeaways"
      ? await buildKeyTakeaways({
          query,
          books: normalizedBooks,
          wikiContext: primaryWikiContext,
        })
      : null;

  const suggestions = buildSuggestions({
    intent,
    books: normalizedBooks,
    query,
  });

  return {
    ok: true,
    mode,
    query,
    timestamp: new Date().toISOString(),
    intent,
    source: {
      googleBooksQuery: effectiveGoogleQuery,
      googleBooksTotalItems: totalItems,
      wikipediaEnrichedItems: wikiMap.size,
    },
    response: answer,
    meta: {
      count: normalizedBooks.length,
      page: {
        startIndex: clamp(startIndex, 0, 1000, 0),
        maxResults: clamp(maxResults, 1, 120, 30),
      },
      modelSignals,
    },
    insight: {
      longSummary,
      keyTakeaways,
    },
    data: normalizedBooks,
    suggestions,
  };
};

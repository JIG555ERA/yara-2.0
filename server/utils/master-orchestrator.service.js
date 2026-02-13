import { booksSearchService } from "./books-search.service.js";
import { executeBookAiQuery } from "./book-ai-execution.service.js";
import { detectQueryType } from "./query-type.router.js";
import { booksAiCapabilities } from "./capabilities.catalog.js";

const dedupeBooks = (collections) => {
  const map = new Map();
  for (const list of collections) {
    for (const item of list || []) {
      if (!item?.id) continue;
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }
  }
  return [...map.values()];
};

const buildMasterSummary = ({ query, routing, mergedCount, sections }) => {
  return {
    header: `Master response for: ${query || "book discovery"}`,
    subheader: `Detected query type: ${routing.queryType} | Merged books: ${mergedCount}`,
    list: [
      `Search module: ${sections.search?.meta?.count ?? 0} items`,
      `Ask module: ${sections.ask?.meta?.count ?? 0} items`,
      `Summary module words: ${sections.summary?.insight?.longSummary?.words ?? 0}`,
      `Execution module models run: ${sections.execute?.modelExecution?.executedModelCount ?? 0}`,
    ],
  };
};

export const masterBooksService = async ({
  query,
  queryType,
  contextText = "",
  volumeId,
  startIndex = 0,
  maxResults = 30,
  includeCapabilities = true,
}) => {
  const routing = queryType
    ? { queryType, group: "custom", confidence: 1, matchedRule: "client_override" }
    : detectQueryType(query);

  const tasks = {
    search: booksSearchService({
      query,
      startIndex,
      maxResults,
      userIntentOnly: false,
      mode: "search",
    }),
    ask: booksSearchService({
      query,
      startIndex,
      maxResults,
      userIntentOnly: true,
      mode: "ask",
    }),
    summary: booksSearchService({
      query,
      startIndex,
      maxResults,
      userIntentOnly: true,
      mode: "summary",
    }),
    execute: executeBookAiQuery({
      query,
      queryType: routing.queryType,
      contextText,
      startIndex,
      maxResults,
    }),
  };

  if (volumeId) {
    tasks.volume = booksSearchService({
      query: volumeId,
      mode: "volume",
      volumeId,
      userIntentOnly: false,
    });
  }

  const settledEntries = await Promise.all(
    Object.entries(tasks).map(async ([key, promise]) => {
      try {
        const value = await promise;
        return [key, { ok: true, value }];
      } catch (err) {
        return [key, { ok: false, error: err?.message || "module failed" }];
      }
    })
  );

  const sections = Object.fromEntries(
    settledEntries.map(([k, result]) => [k, result.ok ? result.value : { ok: false, error: result.error }])
  );

  const mergedBooks = dedupeBooks([
    sections.search?.data,
    sections.ask?.data,
    sections.summary?.data,
    sections.execute?.primary?.data,
  ]);

  const masterSummary = buildMasterSummary({
    query,
    routing,
    mergedCount: mergedBooks.length,
    sections,
  });

  return {
    ok: true,
    endpoint: "master",
    timestamp: new Date().toISOString(),
    query,
    routing,
    summary: masterSummary,
    merged: {
      count: mergedBooks.length,
      books: mergedBooks,
    },
    modules: {
      search: sections.search,
      ask: sections.ask,
      summary: sections.summary,
      execute: sections.execute,
      volume: sections.volume || null,
    },
    capabilities: includeCapabilities ? booksAiCapabilities : null,
    suggestions: sections.ask?.suggestions || sections.search?.suggestions || [],
  };
};

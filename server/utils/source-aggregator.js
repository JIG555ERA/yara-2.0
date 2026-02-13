import { searchVolumes } from "./clients/google-books.client.js";
import { getWikipediaSummary } from "./clients/wikipedia.client.js";
import { searchOpenLibraryBooks } from "./clients/open-library.client.js";
import { searchGutenbergBooks } from "./clients/gutenberg.client.js";
import { lookupWordMeaning } from "./clients/wordnet.client.js";

const settle = async (fn) => {
  try {
    return await fn();
  } catch (_err) {
    return null;
  }
};

export const fetchFromSources = async ({ query, sources, maxResults = 20 }) => {
  const sourceSet = new Set(sources || []);

  const tasks = [];

  if (sourceSet.has("google_books")) {
    tasks.push(settle(async () => ({
      source: "google_books",
      data: await searchVolumes({ query, maxResults }),
    })));
  }

  if (sourceSet.has("open_library")) {
    tasks.push(settle(async () => ({
      source: "open_library",
      data: await searchOpenLibraryBooks({ query, limit: maxResults }),
    })));
  }

  if (sourceSet.has("wikipedia")) {
    tasks.push(settle(async () => ({
      source: "wikipedia",
      data: await getWikipediaSummary(query),
    })));
  }

  if (sourceSet.has("gutenberg")) {
    tasks.push(settle(async () => ({
      source: "gutenberg",
      data: await searchGutenbergBooks({ query }),
    })));
  }

  if (sourceSet.has("wordnet")) {
    const word = (query || "").trim().split(/\s+/)[0] || "book";
    tasks.push(settle(async () => ({
      source: "wordnet",
      data: await lookupWordMeaning(word),
    })));
  }

  const raw = (await Promise.all(tasks)).filter(Boolean);

  const bySource = {};
  for (const item of raw) {
    bySource[item.source] = item.data;
  }

  return bySource;
};

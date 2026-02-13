const YEAR_REGEX = /\b(18\d{2}|19\d{2}|20\d{2}|21\d{2})\b/g;

const clean = (value) => (value || "").toString().trim();
const sanitizeEntity = (value) =>
  clean(value).replace(/\s+(?:in|with)\s+(?:language|lang)\s+[a-z]{2,20}\b.*$/i, "").trim();

const extractYearRange = (query) => {
  const matches = [...query.matchAll(YEAR_REGEX)].map((m) => Number(m[0]));
  if (matches.length >= 2) {
    const start = Math.min(matches[0], matches[1]);
    const end = Math.max(matches[0], matches[1]);
    return { start, end };
  }
  return null;
};

const extractSingleYear = (query) => {
  const match = query.match(YEAR_REGEX);
  return match ? Number(match[0]) : null;
};

const extractPrefixWord = (query, regex) => {
  const match = query.match(regex);
  return match?.[1]?.trim()?.replace(/^[\s"']+|[\s"',.?!]+$/g, "") || null;
};

export const parseQueryIntent = (rawQuery) => {
  const query = clean(rawQuery);
  const normalized = query.toLowerCase();

  if (!query) {
    return {
      intent: "discover",
      query,
      normalized,
      filters: {},
      googleQuery: "popular books",
      confidence: 0.4,
    };
  }

  const startsWith =
    extractPrefixWord(normalized, /(?:start|starts|starting)\s+with\s+([a-z0-9]+)/i) ||
    extractPrefixWord(normalized, /(?:begin|begins|beginning)\s+with\s+([a-z0-9]+)/i);
  const endsWith =
    extractPrefixWord(normalized, /(?:end|ends|ending)\s+with\s+([a-z0-9]+)/i) ||
    extractPrefixWord(normalized, /(?:finish|finishes|finishing)\s+with\s+([a-z0-9]+)/i);
  const publisher = extractPrefixWord(query, /publisher\s*[:=-]?\s*([^,.;]+)/i) ||
    extractPrefixWord(query, /books?\s+from\s+publisher\s+([^,.;]+)/i);
  const authorByPattern = extractPrefixWord(query, /books?\s+by\s+([^,.;]+)/i);
  const author = (authorByPattern && !/^publisher\b/i.test(authorByPattern))
    ? authorByPattern
    : extractPrefixWord(query, /author\s*[:=-]?\s*([^,.;]+)/i);
  const category = extractPrefixWord(query, /(?:category|genre|subject)\s*[:=-]?\s*([^,.;]+)/i);
  const nation = extractPrefixWord(query, /(?:nation|country|region)\s*[:=-]?\s*([^,.;]+)/i);
  const language = extractPrefixWord(query, /(?:language|lang)\s*[:=-]?\s*([a-z]{2,20})/i);
  const takeawayTitle = extractPrefixWord(query, /key\s+takeaways?\s+(?:from|for|of)\s+([^,.;]+)/i);
  const descriptionSearch =
    extractPrefixWord(query, /(?:book|novel)\s+(?:about|where|with)\s+([^,.;]+)/i) ||
    extractPrefixWord(query, /description\s*[:=-]?\s*([^,.;]+)/i);
  const yearRange = extractYearRange(query);
  const singleYear = extractSingleYear(query);
  const isbn = extractPrefixWord(query, /\b(?:isbn(?:-1[03])?\s*[:=-]?\s*)([0-9xX-]{10,17})\b/i);

  if (isbn) {
    return {
      intent: "isbn",
      query,
      normalized,
      filters: { isbn },
      googleQuery: `isbn:${isbn}`,
      confidence: 0.97,
    };
  }

  if (takeawayTitle) {
    return {
      intent: "key_takeaways",
      query,
      normalized,
      filters: { bookTitle: sanitizeEntity(takeawayTitle) },
      googleQuery: `intitle:${sanitizeEntity(takeawayTitle)}`,
      confidence: 0.95,
    };
  }

  if (publisher) {
    return {
      intent: "publisher",
      query,
      normalized,
      filters: { publisher: sanitizeEntity(publisher) },
      googleQuery: `inpublisher:${sanitizeEntity(publisher)}`,
      confidence: 0.92,
    };
  }

  if (author) {
    return {
      intent: "author",
      query,
      normalized,
      filters: { author: sanitizeEntity(author) },
      googleQuery: `inauthor:${sanitizeEntity(author)}`,
      confidence: 0.93,
    };
  }

  if (category) {
    return {
      intent: "category",
      query,
      normalized,
      filters: { category: clean(category) },
      googleQuery: `subject:${clean(category)}`,
      confidence: 0.9,
    };
  }

  if (nation) {
    return {
      intent: "nation",
      query,
      normalized,
      filters: { nation: clean(nation) },
      googleQuery: clean(nation),
      confidence: 0.78,
    };
  }

  if (language) {
    return {
      intent: "language",
      query,
      normalized,
      filters: { language: clean(language).toLowerCase() },
      googleQuery: query,
      confidence: 0.8,
    };
  }

  if (yearRange) {
    return {
      intent: "year_range",
      query,
      normalized,
      filters: { yearRange },
      googleQuery: query,
      confidence: 0.84,
    };
  }

  if (singleYear && /publish|published|year|release/i.test(query)) {
    return {
      intent: "year",
      query,
      normalized,
      filters: { year: singleYear },
      googleQuery: String(singleYear),
      confidence: 0.82,
    };
  }

  if (startsWith) {
    return {
      intent: "title_starts_with",
      query,
      normalized,
      filters: { startsWith },
      googleQuery: startsWith,
      confidence: 0.9,
    };
  }

  if (endsWith) {
    return {
      intent: "title_ends_with",
      query,
      normalized,
      filters: { endsWith },
      googleQuery: endsWith,
      confidence: 0.9,
    };
  }

  if (descriptionSearch) {
    return {
      intent: "description_search",
      query,
      normalized,
      filters: { descriptionSearch: clean(descriptionSearch) },
      googleQuery: clean(descriptionSearch),
      confidence: 0.82,
    };
  }

  return {
    intent: "general_search",
    query,
    normalized,
    filters: {},
    googleQuery: query,
    confidence: 0.7,
  };
};

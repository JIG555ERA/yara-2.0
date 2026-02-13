const normalizeString = (v) => (v || "").toString().toLowerCase().trim();
const normalizeLoose = (v) => normalizeString(v).replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const normalizeYear = (publishedDate) => {
  if (!publishedDate) return null;
  const match = String(publishedDate).match(/\b(18\d{2}|19\d{2}|20\d{2}|21\d{2})\b/);
  return match ? Number(match[1]) : null;
};

const titleMatches = (title, mode, token) => {
  if (!title || !token) return false;
  const t = normalizeLoose(title).replace(/^[^a-z0-9]+/, "");
  const k = normalizeLoose(token);
  if (mode === "starts") return t.startsWith(k);
  if (mode === "ends") return t.endsWith(k);
  return false;
};

const containsAny = (haystack, needle) => normalizeLoose(haystack).includes(normalizeLoose(needle));

const scoreDescriptionMatch = (book, phrase) => {
  if (!phrase) return 0;
  const title = book.volumeInfo?.title || "";
  const subtitle = book.volumeInfo?.subtitle || "";
  const description = book.volumeInfo?.description || "";
  const categories = (book.volumeInfo?.categories || []).join(" ");
  const q = normalizeLoose(phrase);
  let score = 0;
  if (containsAny(title, q)) score += 10;
  if (containsAny(subtitle, q)) score += 7;
  if (containsAny(description, q)) score += 12;
  if (containsAny(categories, q)) score += 6;
  return score;
};

export const applyBookFilters = (books, intentResult) => {
  const items = Array.isArray(books) ? books : [];
  const { intent, filters } = intentResult;

  if (intent === "author" && filters.author) {
    const needle = normalizeString(filters.author);
    return items.filter((book) =>
      (book.volumeInfo.authors || []).some((a) => normalizeString(a).includes(needle))
    );
  }

  if (intent === "publisher" && filters.publisher) {
    const needle = normalizeString(filters.publisher);
    return items.filter((book) => normalizeString(book.volumeInfo.publisher).includes(needle));
  }

  if (intent === "category" && filters.category) {
    const needle = normalizeString(filters.category);
    return items.filter((book) =>
      (book.volumeInfo.categories || []).some((c) => normalizeString(c).includes(needle))
    );
  }

  if (intent === "nation" && filters.nation) {
    const needle = normalizeString(filters.nation);
    return items.filter((book) => normalizeString(book.saleInfo?.country).includes(needle));
  }

  if (intent === "language" && filters.language) {
    const needle = normalizeString(filters.language);
    return items.filter((book) => normalizeString(book.volumeInfo?.language) === needle);
  }

  if (intent === "year" && filters.year) {
    return items.filter((book) => normalizeYear(book.volumeInfo.publishedDate) === filters.year);
  }

  if (intent === "year_range" && filters.yearRange) {
    const { start, end } = filters.yearRange;
    return items.filter((book) => {
      const y = normalizeYear(book.volumeInfo.publishedDate);
      return y !== null && y >= start && y <= end;
    });
  }

  if (intent === "title_starts_with" && filters.startsWith) {
    return items.filter((book) => titleMatches(book.volumeInfo.title, "starts", filters.startsWith));
  }

  if (intent === "title_ends_with" && filters.endsWith) {
    return items.filter((book) => titleMatches(book.volumeInfo.title, "ends", filters.endsWith));
  }

  if (intent === "isbn" && filters.isbn) {
    const needle = normalizeString(filters.isbn).replace(/-/g, "");
    return items.filter((book) =>
      (book.volumeInfo.industryIdentifiers || []).some((id) =>
        normalizeString(id.identifier).replace(/-/g, "") === needle
      )
    );
  }

  if (intent === "key_takeaways" && filters.bookTitle) {
    const needle = normalizeLoose(filters.bookTitle);
    return items.filter((book) => containsAny(book.volumeInfo?.title, needle));
  }

  if (intent === "description_search" && filters.descriptionSearch) {
    return items
      .map((book) => ({ book, score: scoreDescriptionMatch(book, filters.descriptionSearch) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.book);
  }

  return items;
};

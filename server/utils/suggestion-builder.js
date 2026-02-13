const previewTitles = (books, count = 8) =>
  books
    .slice(0, count)
    .map((book) => book.volumeInfo?.title)
    .filter(Boolean);

export const buildSuggestions = ({ intent, books, query }) => {
  const titles = previewTitles(books, 5);
  const firstAuthor = books.find((b) => b.volumeInfo?.authors?.length)?.volumeInfo?.authors?.[0];
  const firstPublisher = books.find((b) => b.volumeInfo?.publisher)?.volumeInfo?.publisher;

  const suggestions = [
    `Show top-rated books similar to \"${titles[0] || query || "this"}\"`,
    `List books published between 2010 and 2020`,
    `Find books ending with \"story\"`,
  ];

  if (firstAuthor) {
    suggestions.push(`Find more books by ${firstAuthor}`);
  }

  if (firstPublisher) {
    suggestions.push(`Show books by publisher ${firstPublisher}`);
  }

  if (intent.intent !== "title_starts_with") {
    suggestions.push("List all books starting with A");
  }

  return suggestions.slice(0, 7);
};

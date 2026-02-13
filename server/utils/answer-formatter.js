const titleOf = (book) => book.volumeInfo?.title || "Unknown title";

export const formatHumanizedAnswer = ({ query, intent, books, totalItems }) => {
  const topTitles = books.slice(0, 8).map(titleOf);

  const header = `Results for: ${query || "Book discovery"}`;
  const subheader =
    `Intent: ${intent.intent.replace(/_/g, " ")} | ` +
    `Matched: ${books.length} | Google total estimate: ${totalItems ?? 0}`;

  const bullets = topTitles.length
    ? topTitles.map((title, idx) => `${idx + 1}. ${title}`)
    : ["No matching books found. Try a broader query."];

  return {
    header,
    subheader,
    list: bullets,
    rendered: `# ${header}\n## ${subheader}\n${bullets.map((b) => `- ${b}`).join("\n")}`,
  };
};

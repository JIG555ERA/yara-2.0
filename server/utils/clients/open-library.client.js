import axios from "axios";

const openLibraryClient = axios.create({
  baseURL: "https://openlibrary.org",
  timeout: 12000,
});

export const searchOpenLibraryBooks = async ({ query, limit = 20 }) => {
  const { data } = await openLibraryClient.get("/search.json", {
    params: {
      q: query || "books",
      limit: Math.max(1, Math.min(50, Number.parseInt(limit, 10) || 20)),
    },
  });
  return data;
};

export const getOpenLibraryAuthor = async (authorKey) => {
  if (!authorKey) return null;
  const clean = String(authorKey).replace(/^\//, "");
  const { data } = await openLibraryClient.get(`/${clean}.json`);
  return data;
};

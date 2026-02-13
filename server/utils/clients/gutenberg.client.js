import axios from "axios";

const gutenbergClient = axios.create({
  baseURL: "https://gutendex.com",
  timeout: 12000,
});

export const searchGutenbergBooks = async ({ query, page = 1 }) => {
  const { data } = await gutenbergClient.get("/books", {
    params: {
      search: query || "literature",
      page: Math.max(1, Number.parseInt(page, 10) || 1),
    },
  });

  return data;
};

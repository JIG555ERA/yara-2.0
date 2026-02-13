import axios from "axios";

const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1";

const googleBooksClient = axios.create({
  baseURL: GOOGLE_BOOKS_BASE,
  timeout: 12000,
});

const normalizeMaxResults = (maxResults = 20) => {
  const value = Number.parseInt(maxResults, 10);
  if (!Number.isFinite(value)) return 20;
  return Math.max(1, Math.min(value, 40));
};

export const searchVolumes = async ({
  query,
  startIndex = 0,
  maxResults = 20,
  printType = "all",
  orderBy,
  langRestrict,
}) => {
  const params = {
    q: query || "books",
    startIndex: Math.max(0, Number.parseInt(startIndex, 10) || 0),
    maxResults: normalizeMaxResults(maxResults),
    printType,
  };

  if (orderBy) params.orderBy = orderBy;
  if (langRestrict) params.langRestrict = langRestrict;
  if (process.env.GOOGLE_BOOKS_API_KEY) {
    params.key = process.env.GOOGLE_BOOKS_API_KEY;
  }

  const { data } = await googleBooksClient.get("/volumes", { params });
  return data;
};

export const getVolumeById = async (volumeId) => {
  const params = {};
  if (process.env.GOOGLE_BOOKS_API_KEY) {
    params.key = process.env.GOOGLE_BOOKS_API_KEY;
  }

  const { data } = await googleBooksClient.get(`/volumes/${encodeURIComponent(volumeId)}`, {
    params,
  });
  return data;
};

import axios from "axios";

const wikiClient = axios.create({
  baseURL: "https://en.wikipedia.org",
  timeout: 9000,
});

export const getWikipediaSummary = async (title) => {
  if (!title || typeof title !== "string") {
    return null;
  }

  const cleanTitle = title.trim();
  if (!cleanTitle) return null;

  try {
    const encoded = encodeURIComponent(cleanTitle);
    const { data } = await wikiClient.get(`/api/rest_v1/page/summary/${encoded}`);

    if (!data || data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
      return null;
    }

    return {
      title: data.title,
      extract: data.extract || null,
      description: data.description || null,
      url: data.content_urls?.desktop?.page || null,
      thumbnail: data.thumbnail?.source || null,
    };
  } catch (_err) {
    return null;
  }
};

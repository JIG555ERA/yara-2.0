import axios from "axios";

const dictionaryClient = axios.create({
  baseURL: "https://api.dictionaryapi.dev/api/v2",
  timeout: 10000,
});

export const lookupWordMeaning = async (word) => {
  if (!word) return null;
  try {
    const { data } = await dictionaryClient.get(`/entries/en/${encodeURIComponent(word)}`);
    return data;
  } catch (_err) {
    return null;
  }
};

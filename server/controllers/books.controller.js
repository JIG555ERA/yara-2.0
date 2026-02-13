import { booksSearchService } from "../utils/books-search.service.js";
import { booksAiCapabilities } from "../utils/capabilities.catalog.js";
import { executeBookAiQuery } from "../utils/book-ai-execution.service.js";
import { masterBooksService } from "../utils/master-orchestrator.service.js";

const parseIntSafe = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};

export const searchBooks = async (req, res, next) => {
  try {
    const query = req.query.query || req.query.q || "";
    const startIndex = parseIntSafe(req.query.startIndex, 0);
    const maxResults = parseIntSafe(req.query.maxResults, 20);

    const response = await booksSearchService({
      query,
      startIndex,
      maxResults,
      userIntentOnly: false,
      mode: "search",
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const askBooks = async (req, res, next) => {
  try {
    const { query = "", startIndex = 0, maxResults = 30 } = req.body || {};

    const response = await booksSearchService({
      query,
      startIndex,
      maxResults,
      userIntentOnly: true,
      mode: "ask",
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const summarizeBooksTopic = async (req, res, next) => {
  try {
    const query = req.query.query || req.query.q || "";
    const startIndex = parseIntSafe(req.query.startIndex, 0);
    const maxResults = parseIntSafe(req.query.maxResults, 30);

    const response = await booksSearchService({
      query,
      startIndex,
      maxResults,
      userIntentOnly: true,
      mode: "summary",
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getBooksAiCapabilities = async (_req, res, next) => {
  try {
    res.status(200).json({
      ok: true,
      timestamp: new Date().toISOString(),
      capabilities: booksAiCapabilities,
    });
  } catch (err) {
    next(err);
  }
};

export const executeBooksAi = async (req, res, next) => {
  try {
    const body = req.body || {};
    const query = body.query || req.query.query || req.query.q || "";
    const queryType = body.queryType || req.query.queryType || null;
    const contextText = body.contextText || "";
    const startIndex = parseIntSafe(body.startIndex ?? req.query.startIndex, 0);
    const maxResults = parseIntSafe(body.maxResults ?? req.query.maxResults, 30);

    const response = await executeBookAiQuery({
      query,
      queryType,
      contextText,
      startIndex,
      maxResults,
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const masterBooksAi = async (req, res, next) => {
  try {
    const body = req.body || {};
    const query = body.query || req.query.query || req.query.q || "";
    const queryType = body.queryType || req.query.queryType || null;
    const contextText = body.contextText || req.query.contextText || "";
    const volumeId = body.volumeId || req.query.volumeId || null;
    const includeCapabilitiesRaw = body.includeCapabilities ?? req.query.includeCapabilities;
    const includeCapabilities =
      includeCapabilitiesRaw === undefined
        ? true
        : String(includeCapabilitiesRaw).toLowerCase() !== "false";

    const startIndex = parseIntSafe(body.startIndex ?? req.query.startIndex, 0);
    const maxResults = parseIntSafe(body.maxResults ?? req.query.maxResults, 30);

    const response = await masterBooksService({
      query,
      queryType,
      contextText,
      volumeId,
      startIndex,
      maxResults,
      includeCapabilities,
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const bookDetailsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await booksSearchService({
      query: id,
      mode: "volume",
      volumeId: id,
      userIntentOnly: false,
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const booksByAuthor = async (req, res, next) => {
  try {
    const author = req.params.author;
    const response = await booksSearchService({
      query: `inauthor:${author}`,
      mode: "search",
      userIntentOnly: false,
    });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const booksByPublisher = async (req, res, next) => {
  try {
    const publisher = req.params.publisher;
    const response = await booksSearchService({
      query: `inpublisher:${publisher}`,
      mode: "search",
      userIntentOnly: false,
    });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const booksByYear = async (req, res, next) => {
  try {
    const year = req.params.year;
    const response = await booksSearchService({
      query: year,
      mode: "search",
      userIntentOnly: true,
    });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

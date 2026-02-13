import { Router } from "express";
import {
  searchBooks,
  askBooks,
  summarizeBooksTopic,
  getBooksAiCapabilities,
  executeBooksAi,
  masterBooksAi,
  bookDetailsById,
  booksByAuthor,
  booksByPublisher,
  booksByYear,
} from "../controllers/books.controller.js";

const router = Router();

router.get("/search", searchBooks);
router.post("/ask", askBooks);
router.get("/summary", summarizeBooksTopic);
router.get("/capabilities", getBooksAiCapabilities);
router.get("/execute", executeBooksAi);
router.post("/execute", executeBooksAi);
router.get("/master", masterBooksAi);
router.post("/master", masterBooksAi);
router.get("/volume/:id", bookDetailsById);
router.get("/author/:author", booksByAuthor);
router.get("/publisher/:publisher", booksByPublisher);
router.get("/year/:year", booksByYear);

export default router;

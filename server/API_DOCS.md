# Books AI API Documentation

Base URL (local): `http://localhost:4000`  
Base URL (Vercel): `https://<your-deployment-domain>`

All endpoints return JSON.

## 1) Health Check
**Endpoint:** `GET /api/health`  
**Use when:** You want to verify service is up.

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/health"
```

### Sample Response
```json
{
  "ok": true,
  "service": "books-ai-search",
  "timestamp": "2026-02-13T18:21:00.000Z"
}
```

---

## 2) Search Books
**Endpoint:** `GET /api/books/search`  
**Use when:** General search where you want broad retrieval and filtering.

### Query Params
- `query` or `q` (string)
- `startIndex` (number, optional)
- `maxResults` (number, optional)

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/search?query=harry%20potter&startIndex=0&maxResults=20"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "mode": "search",
  "query": "harry potter",
  "timestamp": "2026-02-13T18:22:00.000Z",
  "intent": {
    "intent": "general_search",
    "googleQuery": "harry potter",
    "confidence": 0.7
  },
  "source": {
    "googleBooksQuery": "harry potter",
    "googleBooksTotalItems": 1000000,
    "wikipediaEnrichedItems": 8
  },
  "response": {
    "header": "Results for: harry potter",
    "subheader": "Intent: general search | Matched: 20 | Google total estimate: 1000000",
    "list": ["1. Harry Potter and the Sorcerer's Stone"]
  },
  "meta": {
    "count": 20,
    "page": { "startIndex": 0, "maxResults": 20 },
    "modelSignals": { "modelCount": 17, "activeCount": 0, "models": [] }
  },
  "insight": {
    "longSummary": {
      "summary": "....",
      "words": 256,
      "minimumWords": 250,
      "generatedAt": "2026-02-13T18:22:05.000Z"
    },
    "keyTakeaways": null
  },
  "data": [],
  "suggestions": ["Show top-rated books similar to \"Harry Potter\""]
}
```

---

## 3) Ask Books AI
**Endpoint:** `POST /api/books/ask`  
**Use when:** Natural-language question with intent detection and structured answer.

### Sample Request
```bash
curl -X POST "http://localhost:4000/api/books/ask" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"list all books starting with a\",\"startIndex\":0,\"maxResults\":30}"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "mode": "ask",
  "query": "list all books starting with a",
  "intent": {
    "intent": "title_starts_with",
    "filters": { "startsWith": "a" },
    "googleQuery": "a"
  },
  "response": {
    "header": "Results for: list all books starting with a",
    "subheader": "Intent: title starts with | Matched: 12 | Google total estimate: 50000",
    "list": ["1. Atomic Habits", "2. Animal Farm"]
  },
  "insight": {
    "longSummary": { "words": 250 },
    "keyTakeaways": null
  }
}
```

---

## 4) Summary Endpoint
**Endpoint:** `GET /api/books/summary`  
**Use when:** You specifically want summary-centric output.

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/summary?query=Atomic%20Habits"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "mode": "summary",
  "query": "Atomic Habits",
  "insight": {
    "longSummary": {
      "summary": ".... (250+ words)",
      "words": 274,
      "minimumWords": 250,
      "generatedAt": "2026-02-13T18:25:00.000Z"
    },
    "keyTakeaways": null
  }
}
```

---

## 5) Capabilities Catalog
**Endpoint:** `GET /api/books/capabilities`  
**Use when:** Frontend needs all supported query categories, model mapping, and source mapping.

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/capabilities"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "timestamp": "2026-02-13T18:26:00.000Z",
  "capabilities": {
    "generatedAt": "2026-02-13T18:26:00.000Z",
    "groups": [
      {
        "id": "content_discovery",
        "name": "Content Discovery & Recommendation",
        "intents": []
      }
    ],
    "dataSources": ["Project Gutenberg", "Open Library", "Google Books API", "Wikipedia"]
  }
}
```

---

## 6) Execute Router (GET)
**Endpoint:** `GET /api/books/execute`  
**Use when:** You want auto-routed pipeline execution from query text.

### Query Params
- `query` (string)
- `queryType` (optional override)
- `startIndex` (optional)
- `maxResults` (optional)

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/execute?query=Suggest%20books%20like%20Atomic%20Habits"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "timestamp": "2026-02-13T18:27:00.000Z",
  "query": "Suggest books like Atomic Habits",
  "queryRouting": {
    "queryType": "book_recommendation",
    "group": "content_discovery",
    "confidence": 0.86
  },
  "executionPlan": {
    "models": ["semantic_ranker", "recommendation_reasoner"],
    "sources": ["google_books", "open_library", "wikipedia"]
  },
  "promptTemplate": {
    "task": "text2text-generation",
    "prompt": "Recommend books...",
    "format": []
  },
  "sourceStats": [
    { "source": "google_books", "count": 20 },
    { "source": "open_library", "count": 20 },
    { "source": "wikipedia", "count": 1 }
  ],
  "primary": {},
  "secondarySources": {},
  "modelExecution": {
    "requestedModelCount": 4,
    "executedModelCount": 4,
    "activeCount": 0,
    "models": []
  },
  "summary": {
    "header": "Executed book recommendation pipeline",
    "subheader": "Group: content_discovery | Sources: google_books, open_library, wikipedia | Models: semantic_ranker, recommendation_reasoner",
    "list": ["Top results from primary search: 20"]
  }
}
```

---

## 7) Execute Router (POST)
**Endpoint:** `POST /api/books/execute`  
**Use when:** You want full control over query + optional `queryType` override + context payload.

### Sample Request
```bash
curl -X POST "http://localhost:4000/api/books/execute" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"Create MCQs from chapter 2 of Atomic Habits\",
    \"queryType\": \"mcq_generation\",
    \"contextText\": \"Focus on habit loop and implementation intentions\",
    \"startIndex\": 0,
    \"maxResults\": 20
  }"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "queryRouting": {
    "queryType": "mcq_generation",
    "group": "custom",
    "confidence": 1
  },
  "executionPlan": {
    "models": ["answer_composer"],
    "sources": ["gutenberg"]
  },
  "modelExecution": {
    "executedModelCount": 3
  },
  "summary": {
    "header": "Executed mcq generation pipeline"
  }
}
```

---

## 8) Master Endpoint (GET)
**Endpoint:** `GET /api/books/master`  
**Use when:** You want one merged response that combines search, ask, summary, execute, and optional volume detail/capabilities.

### Query Params
- `query` (string)
- `queryType` (optional override)
- `contextText` (optional)
- `volumeId` (optional)
- `startIndex` (optional)
- `maxResults` (optional)
- `includeCapabilities` (`true|false`, optional, default `true`)

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/master?query=books%20by%20penguin%20starting%20with%20a&maxResults=20"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "endpoint": "master",
  "timestamp": "2026-02-13T18:31:00.000Z",
  "query": "books by penguin starting with a",
  "routing": {
    "queryType": "book_recommendation",
    "group": "content_discovery",
    "confidence": 0.86
  },
  "summary": {
    "header": "Master response for: books by penguin starting with a",
    "subheader": "Detected query type: book_recommendation | Merged books: 26",
    "list": [
      "Search module: 20 items",
      "Ask module: 12 items",
      "Summary module words: 250",
      "Execution module models run: 4"
    ]
  },
  "merged": {
    "count": 26,
    "books": []
  },
  "modules": {
    "search": {},
    "ask": {},
    "summary": {},
    "execute": {},
    "volume": null
  },
  "capabilities": {},
  "suggestions": []
}
```

---

## 9) Master Endpoint (POST)
**Endpoint:** `POST /api/books/master`  
**Use when:** You want the same master merge behavior with body payload control.

### Sample Request
```bash
curl -X POST "http://localhost:4000/api/books/master" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"Create MCQs from chapter 2 of Atomic Habits\",
    \"queryType\": \"mcq_generation\",
    \"contextText\": \"focus on implementation intentions\",
    \"volumeId\": null,
    \"startIndex\": 0,
    \"maxResults\": 20,
    \"includeCapabilities\": false
  }"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "endpoint": "master",
  "routing": {
    "queryType": "mcq_generation",
    "group": "custom",
    "confidence": 1
  },
  "merged": {
    "count": 14,
    "books": []
  },
  "modules": {
    "search": {},
    "ask": {},
    "summary": {},
    "execute": {
      "executionPlan": {
        "models": ["answer_composer"],
        "sources": ["gutenberg"]
      }
    }
  },
  "capabilities": null
}
```

---

## 10) Volume Detail by ID
**Endpoint:** `GET /api/books/volume/:id`  
**Use when:** You already have Google volume ID and want complete enriched detail.

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/volume/fo4rzdaHDAwC"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "mode": "volume",
  "timestamp": "2026-02-13T18:30:00.000Z",
  "data": {
    "id": "fo4rzdaHDAwC",
    "volumeInfo": {
      "title": "Harry Potter and the Sorcerer's Stone",
      "authors": ["J. K. Rowling"],
      "publisher": "Arthur A. Levine Books",
      "wikipedia": {
        "title": "Harry Potter and the Philosopher's Stone",
        "extract": "...."
      }
    },
    "saleInfo": {},
    "accessInfo": {},
    "raw": {}
  },
  "response": {
    "header": "Book detail: Harry Potter and the Sorcerer's Stone",
    "subheader": "Detailed volume payload from Google Books enriched with Wikipedia.",
    "list": ["Author(s): J. K. Rowling"]
  },
  "suggestions": ["Find more books by this author"]
}
```

---

## 11) Books by Author
**Endpoint:** `GET /api/books/author/:author`  
**Use when:** You want books from a specific author quickly.

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/author/james%20clear"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "mode": "search",
  "query": "inauthor:james clear",
  "meta": { "count": 10 },
  "data": []
}
```

---

## 12) Books by Publisher
**Endpoint:** `GET /api/books/publisher/:publisher`  
**Use when:** You want books from a specific publisher.

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/publisher/penguin"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "mode": "search",
  "query": "inpublisher:penguin",
  "meta": { "count": 20 },
  "data": []
}
```

---

## 13) Books by Year
**Endpoint:** `GET /api/books/year/:year`  
**Use when:** You want books around a target year via intent-based filtering.

### Sample Request
```bash
curl -X GET "http://localhost:4000/api/books/year/2019"
```

### Sample Response (shortened)
```json
{
  "ok": true,
  "mode": "search",
  "query": "2019",
  "intent": {
    "intent": "year",
    "filters": { "year": 2019 }
  },
  "meta": { "count": 15 },
  "data": []
}
```

---

## Which Endpoint to Hit (Quick Guide)
1. Service health: `GET /api/health`
2. Normal book search: `GET /api/books/search`
3. Natural language ask: `POST /api/books/ask`
4. 250+ word summary focus: `GET /api/books/summary`
5. Query-type auto routing + source/model execution: `GET/POST /api/books/execute`
6. Master merged response (best single endpoint): `GET/POST /api/books/master`
7. Get platform capability map for UI routing: `GET /api/books/capabilities`
8. Known volume detail by ID: `GET /api/books/volume/:id`
9. Direct author/publisher/year filters: `/api/books/author/:author`, `/api/books/publisher/:publisher`, `/api/books/year/:year`

---

## Notes
1. For complex operations (MCQ generation, chapter summary, key ideas, rewrite, flashcards, etc.), prefer `POST /api/books/execute`.
2. If you want deterministic behavior, pass explicit `queryType` in execute API.
3. Local model runtime can be toggled by env var `ENABLE_LOCAL_NLP=true`.
4. If you want one consolidated response for UI, prefer `GET/POST /api/books/master`.

import { detectQueryType } from "./query-type.router.js";
import { getExecutionPlan } from "./execution-plans.js";
import { resolvePromptTemplate } from "./prompt-templates.js";
import { fetchFromSources } from "./source-aggregator.js";
import { booksSearchService } from "./books-search.service.js";
import { runSelectedModels } from "./nlp-orchestrator.js";

const pickTopTitles = (books, count = 5) =>
  (books || []).slice(0, count).map((b) => b?.volumeInfo?.title).filter(Boolean);

const safeCount = (data) => {
  if (!data) return 0;
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(data.items)) return data.items.length;
  if (Array.isArray(data.docs)) return data.docs.length;
  if (Array.isArray(data.results)) return data.results.length;
  return 1;
};

export const executeBookAiQuery = async ({
  query,
  queryType,
  contextText,
  startIndex = 0,
  maxResults = 30,
}) => {
  const detected = queryType
    ? { queryType, group: "custom", confidence: 1, matchedRule: "client_override" }
    : detectQueryType(query);

  const plan = getExecutionPlan(detected.queryType);

  const primary = await booksSearchService({
    query,
    startIndex,
    maxResults,
    userIntentOnly: true,
    mode: "execute",
  });

  const secondarySources = await fetchFromSources({
    query,
    sources: plan.sources,
    maxResults,
  });

  const topTitle = primary?.data?.[0]?.volumeInfo?.title || "";
  const template = resolvePromptTemplate({
    queryType: detected.queryType,
    query,
    title: topTitle,
  });

  const prompt = [
    `Query Type: ${detected.queryType}`,
    `Query: ${query || ""}`,
    `Top Titles: ${pickTopTitles(primary?.data || []).join(", ")}`,
    `Template Prompt: ${template.prompt}`,
    contextText ? `User Context: ${contextText}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const modelExecution = await runSelectedModels({
    modelIds: [...plan.models, "response_evaluator", "query_understanding"],
    prompt,
    context: {
      query,
      queryType: detected.queryType,
      sourceSummary: Object.keys(secondarySources),
      topBooks: primary?.data || [],
    },
  });

  const sourceStats = Object.entries(secondarySources).map(([name, payload]) => ({
    source: name,
    count: safeCount(payload),
  }));

  return {
    ok: true,
    timestamp: new Date().toISOString(),
    query,
    queryRouting: detected,
    executionPlan: plan,
    promptTemplate: template,
    sourceStats,
    primary,
    secondarySources,
    modelExecution,
    summary: {
      header: `Executed ${detected.queryType.replace(/_/g, " ")} pipeline`,
      subheader: `Group: ${detected.group} | Sources: ${plan.sources.join(", ")} | Models: ${plan.models.join(", ")}`,
      list: [
        `Top results from primary search: ${primary?.meta?.count ?? 0}`,
        `Secondary sources fetched: ${Object.keys(secondarySources).length}`,
        `Models executed: ${modelExecution.executedModelCount}`,
      ],
    },
  };
};

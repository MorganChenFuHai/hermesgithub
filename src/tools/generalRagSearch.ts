import type { CorpusPluginConfig } from "./http";

export type RagToolPreset = {
  toolName: string;
  description?: string;
  corpusIdList: string;
  maxCosineDistance: number;
  maxSearch: number;
};

const GENERAL_RAG_DESCRIPTION =
  "面向企业私有文档库做语义检索  仅传 userQuery 参数，成功时 content[0].text 为 JSON（常见含 chunk）；失败时含 success:false 与 errorMessage。";
const GENERAL_RAG_MAX_COSINE_DISTANCE = 0.5;
const GENERAL_RAG_MAX_SEARCH = 10;

/** 语料 ID 须由 plugins.entries.corpus.config.generalRagCorpusIdList 提供；此处仅占位 */
export const GENERAL_RAG_TOOL_PRESET: RagToolPreset = {
  toolName: "general-rag-search",
  description: GENERAL_RAG_DESCRIPTION,
  corpusIdList: "",
  maxCosineDistance: GENERAL_RAG_MAX_COSINE_DISTANCE,
  maxSearch: GENERAL_RAG_MAX_SEARCH,
};

export function resolveGeneralRagPreset(config: CorpusPluginConfig): RagToolPreset {
  const corpusIdList = config.generalRagCorpusIdList?.trim() ?? "";
  return { ...GENERAL_RAG_TOOL_PRESET, corpusIdList };
}

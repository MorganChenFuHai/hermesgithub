import type { CorpusPluginConfig } from "./http";

export type KgToolPreset = {
  toolName: string;
  description?: string;
  domain: string;
};

const GENERAL_KG_DESCRIPTION =
  "面向企业私有知识图谱库做语义检索  仅传 userQuery 参数，成功时 content[0].text 为 JSON（常见含 summary、triplets、chunk）；失败为 success:false 与 errorMessage。";

/** 领域须由 plugins.entries.corpus.config.generalKgSearchDomain 提供；此处仅占位 */
export const GENERAL_KG_TOOL_PRESET: KgToolPreset = {
  toolName: "general-kg-search",
  domain: "",
  description: GENERAL_KG_DESCRIPTION,
};

export function resolveGeneralKgPreset(config: CorpusPluginConfig): KgToolPreset {
  const domain = config.generalKgSearchDomain?.trim() ?? "";
  return { ...GENERAL_KG_TOOL_PRESET, domain };
}

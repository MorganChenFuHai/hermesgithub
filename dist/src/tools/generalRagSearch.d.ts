import type { CorpusPluginConfig } from "./http";
export type RagToolPreset = {
    toolName: string;
    description?: string;
    corpusIdList: string;
    maxCosineDistance: number;
    maxSearch: number;
};
/** 语料 ID 须由 plugins.entries.corpus.config.generalRagCorpusIdList 提供；此处仅占位 */
export declare const GENERAL_RAG_TOOL_PRESET: RagToolPreset;
export declare function resolveGeneralRagPreset(config: CorpusPluginConfig): RagToolPreset;

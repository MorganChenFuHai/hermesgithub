import type { CorpusPluginConfig } from "./http";
export type KgToolPreset = {
    toolName: string;
    description?: string;
    domain: string;
};
/** 领域须由 plugins.entries.corpus.config.generalKgSearchDomain 提供；此处仅占位 */
export declare const GENERAL_KG_TOOL_PRESET: KgToolPreset;
export declare function resolveGeneralKgPreset(config: CorpusPluginConfig): KgToolPreset;

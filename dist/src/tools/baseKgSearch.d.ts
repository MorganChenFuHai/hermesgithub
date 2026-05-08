import type { KgToolPreset } from "./generalKgSearch";
import type { CorpusPluginConfig } from "./http";
export type { KgToolPreset };
export declare function buildKgSearchTool(registrationConfig: CorpusPluginConfig, resolvePreset: (config: CorpusPluginConfig) => KgToolPreset): {
    name: string;
    description: string;
    parameters: {
        userQuery: {
            type: "string";
            description: string;
        };
    };
    execute: (_id: string, params: {
        userQuery: string;
    }, runtimeConfig: unknown) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};

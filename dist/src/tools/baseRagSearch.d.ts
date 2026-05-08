import type { RagToolPreset } from "./generalRagSearch";
import type { CorpusPluginConfig } from "./http";
export type { RagToolPreset };
export declare function buildRagSearchTool(registrationConfig: CorpusPluginConfig, resolvePreset: (config: CorpusPluginConfig) => RagToolPreset): {
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

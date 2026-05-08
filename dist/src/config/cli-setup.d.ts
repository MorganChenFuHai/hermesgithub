interface PluginConfig {
    baseUrl: string;
    apiKey: string;
    dataAuthKey: string;
    generalRagCorpusIdList: string;
    generalKgSearchDomain: string;
}
export declare function runInteractiveSetup(): Promise<PluginConfig>;
export {};

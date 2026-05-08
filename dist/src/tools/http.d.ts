/** 与 openclaw.plugin.json#configSchema 及 plugins.entries.corpus.config 对齐 */
export interface CorpusPluginConfig {
    baseUrl?: string;
    apiKey?: string;
    dataAuthKey?: string;
    generalRagCorpusIdList?: string;
    generalKgSearchDomain?: string;
}
export interface RequestContext {
    baseUrl: string;
    headers: Record<string, string>;
    timeout: number;
}
/** 将网关传入的 pluginConfig 规范为 CorpusPluginConfig（忽略未知键） */
export declare function normalizeCorpusPluginConfig(raw: unknown): CorpusPluginConfig;
/** register 阶段配置为底，execute 传入的运行时值按字段覆盖（有值才覆盖） */
export declare function mergeCorpusPluginConfigRuntime(base: CorpusPluginConfig, runtime: unknown): CorpusPluginConfig;
/** 发起 HTTP 请求前校验连接项（业务项由各 preset 处理） */
export declare function validateCorpusHttpConfig(config: CorpusPluginConfig): string | undefined;
export declare function buildRequestContext(config: CorpusPluginConfig): RequestContext;
export declare function postJson<TResponse>(url: string, body: unknown, headers: Record<string, string>, timeout?: number): Promise<TResponse>;

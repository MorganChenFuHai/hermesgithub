/** 请求头名固定，不可通过配置改名 */
const API_KEY_HEADER_NAME = "X-API-Key";
const DATA_AUTH_KEY_HEADER_NAME = "dataAuthKey";
const HTTP_TIMEOUT_MS = 30000;

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
export function normalizeCorpusPluginConfig(raw: unknown): CorpusPluginConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const o = raw as Record<string, unknown>;
  const str = (k: string): string | undefined => {
    const v = o[k];
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    return t.length > 0 ? t : undefined;
  };
  return {
    baseUrl: str("baseUrl"),
    apiKey: str("apiKey"),
    dataAuthKey: str("dataAuthKey"),
    generalRagCorpusIdList: str("generalRagCorpusIdList"),
    generalKgSearchDomain: str("generalKgSearchDomain"),
  };
}

const CONFIG_KEYS: (keyof CorpusPluginConfig)[] = [
  "baseUrl",
  "apiKey",
  "dataAuthKey",
  "generalRagCorpusIdList",
  "generalKgSearchDomain",
];

/** register 阶段配置为底，execute 传入的运行时值按字段覆盖（有值才覆盖） */
export function mergeCorpusPluginConfigRuntime(
  base: CorpusPluginConfig,
  runtime: unknown
): CorpusPluginConfig {
  const r = normalizeCorpusPluginConfig(runtime);
  const out: CorpusPluginConfig = { ...base };
  for (const k of CONFIG_KEYS) {
    if (r[k] !== undefined) out[k] = r[k];
  }
  return out;
}

/** 发起 HTTP 请求前校验连接项（业务项由各 preset 处理） */
export function validateCorpusHttpConfig(config: CorpusPluginConfig): string | undefined {
  if (!config.baseUrl?.trim()) {
    return "baseUrl 为空：请在 ~/.openclaw/openclaw.json 的 plugins.entries.corpus.config 中设置 baseUrl";
  }
  if (!config.apiKey?.trim()) {
    return "apiKey 为空：请在 plugins.entries.corpus.config 中设置 apiKey";
  }
  if (!config.dataAuthKey?.trim()) {
    return "dataAuthKey 为空：请在 plugins.entries.corpus.config 中设置 dataAuthKey";
  }
  return undefined;
}

export function buildRequestContext(config: CorpusPluginConfig): RequestContext {
  const baseUrl = config.baseUrl!.trim().replace(/\/+$/, "");
  const dataAuthKey = config.dataAuthKey!.trim();
  const apiKey = config.apiKey!.trim();
  const headers: Record<string, string> = {
    [DATA_AUTH_KEY_HEADER_NAME]: dataAuthKey,
    [API_KEY_HEADER_NAME]: apiKey,
  };
  return { baseUrl, headers, timeout: HTTP_TIMEOUT_MS };
}

export async function postJson<TResponse>(
  url: string,
  body: unknown,
  headers: Record<string, string>,
  timeout = HTTP_TIMEOUT_MS
): Promise<TResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return (await response.json()) as TResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}

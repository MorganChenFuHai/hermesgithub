import type { KgToolPreset } from "./generalKgSearch";
import type { CorpusPluginConfig } from "./http";
import {
  buildRequestContext,
  mergeCorpusPluginConfigRuntime,
  postJson,
  validateCorpusHttpConfig,
} from "./http";

const KG_PATH = "/api/builtin-plugin/plugin/queryByKgTripletRetrieveLite";

export type { KgToolPreset };

export function buildKgSearchTool(
  registrationConfig: CorpusPluginConfig,
  resolvePreset: (config: CorpusPluginConfig) => KgToolPreset
) {
  const presetRegister = resolvePreset(registrationConfig);
  const { toolName, description: registeredDescription = "" } = presetRegister;

  async function execute(_id: string, params: { userQuery: string }, runtimeConfig: unknown) {
    const pack = (o: unknown) => ({
      content: [{ type: "text" as const, text: JSON.stringify(o, null, 2) }],
    });
    try {
      const config = mergeCorpusPluginConfigRuntime(registrationConfig, runtimeConfig);
      const preset = resolvePreset(config);
      const domain = (preset.domain ?? "").trim();
      if (!domain) {
        return pack({
          success: false,
          errorMessage:
            "domain 为空：请在 ~/.openclaw/openclaw.json 的 plugins.entries.corpus.config.generalKgSearchDomain 中配置",
        });
      }
      if (domain.includes(",") || domain.includes("，")) {
        return pack({ success: false, errorMessage: "domain 仅允许单个值，preset 中不要配置逗号拼接多个" });
      }
      const httpErr = validateCorpusHttpConfig(config);
      if (httpErr) return pack({ success: false, errorMessage: httpErr });
      const { baseUrl, headers, timeout } = buildRequestContext(config);
      const raw = await postJson(
        `${baseUrl}${KG_PATH}`,
        { domain, userQuery: params.userQuery },
        headers,
        timeout
      );
      const body = raw as { success: boolean; errorMessage?: string; data?: unknown };
      if (!body.success) return pack({ success: false, errorMessage: body.errorMessage });
      return pack(body.data ?? {});
    } catch (e) {
      return pack({ success: false, errorMessage: e instanceof Error ? e.message : String(e) });
    }
  }

  return {
    name: toolName,
    description: registeredDescription,
    parameters: {
      userQuery: {
        type: "string" as const,
        description: "必填。用户问题或检索文本，建议完整自然语言。",
      },
    },
    execute,
  };
}

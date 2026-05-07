import type { RagToolPreset } from "./generalRagSearch";
import type { CorpusPluginConfig } from "./http";
import {
  buildRequestContext,
  mergeCorpusPluginConfigRuntime,
  postJson,
  validateCorpusHttpConfig,
} from "./http";

const RAG_PATH = "/api/builtin-plugin/plugin/queryChunksByRag";

export type { RagToolPreset };

export function buildRagSearchTool(
  registrationConfig: CorpusPluginConfig,
  resolvePreset: (config: CorpusPluginConfig) => RagToolPreset
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
      const { corpusIdList, maxCosineDistance, maxSearch } = preset;
      if (!corpusIdList?.trim()) {
        return pack({
          success: false,
          errorMessage:
            "corpusIdList 为空：请在 plugins.entries.corpus.config.generalRagCorpusIdList 中配置（逗号分隔语料 ID）",
        });
      }
      if (maxCosineDistance === undefined || !Number.isFinite(maxCosineDistance)) {
        return pack({
          success: false,
          errorMessage:
            "maxCosineDistance 未配置或无效（应为代码常量，请联系维护者）",
        });
      }
      if (maxSearch === undefined || !Number.isFinite(maxSearch) || maxSearch <= 0) {
        return pack({
          success: false,
          errorMessage:
            "maxSearch 未配置或无效（应为代码常量，请联系维护者）",
        });
      }
      const httpErr = validateCorpusHttpConfig(config);
      if (httpErr) return pack({ success: false, errorMessage: httpErr });
      const { baseUrl, headers, timeout } = buildRequestContext(config);
      const raw = await postJson(
        `${baseUrl}${RAG_PATH}`,
        {
          userQuery: params.userQuery,
          corpusIdList: corpusIdList.trim(),
          maxCosineDistance,
          maxSearch,
        },
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
        description: "必填。用户问题或检索文本，建议自然语言完整表述。",
      },
    },
    execute,
  };
}

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { buildKgSearchTool } from "./src/tools/baseKgSearch";
import { buildRagSearchTool } from "./src/tools/baseRagSearch";
import { resolveGeneralKgPreset } from "./src/tools/generalKgSearch";
import { resolveGeneralRagPreset } from "./src/tools/generalRagSearch";
import { normalizeCorpusPluginConfig, type CorpusPluginConfig } from "./src/tools/http";
import { runInteractiveSetup } from "./src/config/cli-setup";

export type { CorpusPluginConfig } from "./src/tools/http";
export { mergeCorpusPluginConfigRuntime, normalizeCorpusPluginConfig } from "./src/tools/http";

function isConfigured(cfg: CorpusPluginConfig): boolean {
  return !!(cfg.baseUrl && cfg.apiKey && cfg.dataAuthKey && cfg.generalRagCorpusIdList && cfg.generalKgSearchDomain);
}

function getMissingConfigs(cfg: CorpusPluginConfig): string[] {
  const missing: string[] = [];
  if (!cfg.baseUrl) missing.push("baseUrl");
  if (!cfg.apiKey) missing.push("apiKey");
  if (!cfg.dataAuthKey) missing.push("dataAuthKey");
  if (!cfg.generalRagCorpusIdList) missing.push("generalRagCorpusIdList");
  if (!cfg.generalKgSearchDomain) missing.push("generalKgSearchDomain");
  return missing;
}

export default definePluginEntry({
  id: "corpus",
  name: "Corpus RAG & KG Search",
  description: "语料库搜索与知识图谱查询工具",
  register(api) {
    const cfg = normalizeCorpusPluginConfig(api.pluginConfig);

    api.on?.("gateway_start", async () => {
      if (!isConfigured(cfg)) {
        console.error("[Corpus Plugin] ⚠️ 插件未配置。请运行：openclaw corpus setup");
      }
    });

    api.on?.("before_tool_call", async ({ tool }: { tool: { name: string } }) => {
      if (tool.name === "general-rag-search" || tool.name === "general-kg-search") {
        const currentCfg = normalizeCorpusPluginConfig(api.pluginConfig);
        if (!isConfigured(currentCfg)) {
          const missingConfigs = getMissingConfigs(currentCfg);
          const missingList = missingConfigs.map(k => `\`${k}\``).join(", ");
          
          return {
            block: true,
            blockReason: `Corpus 插件缺少必要配置：${missingList}。\n\n请选择以下任一方式完成配置：\n\n1. 运行交互式配置命令：\n   openclaw corpus setup\n\n2. 或直接设置缺失的配置项：\n   openclaw config set plugins.entries.corpus.config.${missingConfigs[0]} "YOUR_VALUE"\n\n示例：\n   openclaw config set plugins.entries.corpus.config.baseUrl "http://8.153.76.59:8082"\n   openclaw config set plugins.entries.corpus.config.apiKey "YOUR_API_KEY"\n   openclaw config set plugins.entries.corpus.config.dataAuthKey "YOUR_DATA_AUTH_KEY"`,
          };
        }
      }
      return { block: false };
    });

    api.registerTool?.(buildRagSearchTool(cfg, resolveGeneralRagPreset));
    api.registerTool?.(buildKgSearchTool(cfg, resolveGeneralKgPreset));

    api.registerCli?.(
      ({ program }) => {
        const corpus = program
          .command("corpus")
          .description("Corpus plugin commands");

        corpus
          .command("setup")
          .description("Interactive configuration wizard for corpus plugin")
          .action(async () => {
            await runInteractiveSetup();
          });
      },
      {
        descriptors: [
          {
            name: "corpus",
            description: "Corpus plugin commands",
            hasSubcommands: true,
          },
        ],
      },
    );
  },
});

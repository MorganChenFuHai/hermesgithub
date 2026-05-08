import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { buildKgSearchTool } from "./src/tools/baseKgSearch";
import { buildRagSearchTool } from "./src/tools/baseRagSearch";
import { resolveGeneralKgPreset } from "./src/tools/generalKgSearch";
import { resolveGeneralRagPreset } from "./src/tools/generalRagSearch";
import { normalizeCorpusPluginConfig } from "./src/tools/http";
import { runInteractiveSetup } from "./src/config/cli-setup";
export { mergeCorpusPluginConfigRuntime, normalizeCorpusPluginConfig } from "./src/tools/http";
function isConfigured(cfg) {
    return !!(cfg.baseUrl && cfg.apiKey && cfg.dataAuthKey && cfg.generalRagCorpusIdList && cfg.generalKgSearchDomain);
}
function getMissingConfigs(cfg) {
    const missing = [];
    if (!cfg.baseUrl)
        missing.push("baseUrl");
    if (!cfg.apiKey)
        missing.push("apiKey");
    if (!cfg.dataAuthKey)
        missing.push("dataAuthKey");
    if (!cfg.generalRagCorpusIdList)
        missing.push("generalRagCorpusIdList");
    if (!cfg.generalKgSearchDomain)
        missing.push("generalKgSearchDomain");
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
        api.on?.("before_tool_call", async ({ tool }) => {
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
        api.registerCli?.(({ program }) => {
            const corpus = program
                .command("corpus")
                .description("Corpus plugin commands");
            corpus
                .command("setup")
                .description("Interactive configuration wizard for corpus plugin")
                .action(async () => {
                await runInteractiveSetup();
            });
        }, {
            descriptors: [
                {
                    name: "corpus",
                    description: "Corpus plugin commands",
                    hasSubcommands: true,
                },
            ],
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsMkJBQTJCLEVBQTJCLE1BQU0sa0JBQWtCLENBQUM7QUFDeEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHN0QsT0FBTyxFQUFFLDhCQUE4QixFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFL0YsU0FBUyxZQUFZLENBQUMsR0FBdUI7SUFDM0MsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsc0JBQXNCLElBQUksR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDckgsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsR0FBdUI7SUFDaEQsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTztRQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNO1FBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVc7UUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLGFB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cm9tIFwib3BlbmNsYXcvcGx1Z2luLXNkay9wbHVnaW4tZW50cnlcIjtcbmltcG9ydCB7IGJ1aWxkS2dTZWFyY2hUb29sIH0gZnJvbSBcIi4vc3JjL3Rvb2xzL2Jhc2VLZ1NlYXJjaFwiO1xuaW1wb3J0IHsgYnVpbGRSYWdTZWFyY2hUb29sIH0gZnJvbSBcIi4vc3JjL3Rvb2xzL2Jhc2VSYWdTZWFyY2hcIjtcbmltcG9ydCB7IHJlc29sdmVHZW5lcmFsS2dQcmVzZXQgfSBmcm9tIFwiLi9zcmMvdG9vbHMvZ2VuZXJhbEtnU2VhcmNoXCI7XG5pbXBvcnQgeyByZXNvbHZlR2VuZXJhbFJhZ1ByZXNldCB9IGZyb20gXCIuL3NyYy90b29scy9nZW5lcmFsUmFnU2VhcmNoXCI7XG5pbXBvcnQgeyBub3JtYWxpemVDb3JwdXNQbHVnaW5Db25maWcsIHR5cGUgQ29ycHVzUGx1Z2luQ29uZmlnIH0gZnJvbSBcIi4vc3JjL3Rvb2xzL2h0dHBcIjtcbmltcG9ydCB7IHJ1bkludGVyYWN0aXZlU2V0dXAgfSBmcm9tIFwiLi9zcmMvY29uZmlnL2NsaS1zZXR1cFwiO1xuXG5leHBvcnQgdHlwZSB7IENvcnB1c1BsdWdpbkNvbmZpZyB9IGZyb20gXCIuL3NyYy90b29scy9odHRwXCI7XG5leHBvcnQgeyBtZXJnZUNvcnB1c1BsdWdpbkNvbmZpZ1J1bnRpbWUsIG5vcm1hbGl6ZUNvcnB1c1BsdWdpbkNvbmZpZyB9IGZyb20gXCIuL3NyYy90b29scy9odHRwXCI7XG5cbmZ1bmN0aW9uIGlzQ29uZmlndXJlZChjZmc6IENvcnB1c1BsdWdpbkNvbmZpZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gISEoY2ZnLmJhc2VVcmwgJiYgY2ZnLmFwaUtleSAmJiBjZmcuZGF0YUF1dGhLZXkgJiYgY2ZnLmdlbmVyYWxSYWdDb3JwdXNJZExpc3QgJiYgY2ZnLmdlbmVyYWxLZ1NlYXJjaERvbWFpbik7XG59XG5cbmZ1bmN0aW9uIGdldE1pc3NpbmdDb25maWdzKGNmZzogQ29ycHVzUGx1Z2luQ29uZmlnKTogc3RyaW5nW10ge1xuICBjb25zdCBtaXNzaW5nOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoIWNmZy5iYXNlVXJsKSBtaXNzaW5nLnB1c2goXCJiYXNlVXJsXCIpO1xuICBpZiAoIWNmZy5hcGlLZXkpIG1pc3NpbmcucHVzaChcImFwaUtleVwiKTtcbiAgaWYgKCFjZmcuZGF0YUF1dGhLZXkpIG1pc3NpbmcucHVzaChcImRhdGFBdXRoS2V5XCIpO1xuICBpZiAoIWNmZy5nZW5lcmFsUmFnQ29ycHVzSWRMaXN0KSBtaXNzaW5nLnB1c2goXCJnZW5lcmFsUmFnQ29ycHVzSWRMaXN0XCIpO1xuICBpZiAoIWNmZy5nZW5lcmFsS2dTZWFyY2hEb21haW4pIG1pc3NpbmcucHVzaChcImdlbmVyYWxLZ1NlYXJjaERvbWFpblwiKTtcbiAgcmV0dXJuIG1pc3Npbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZVBsdWdpbkVudHJ5KHtcbiAgaWQ6IFwiY29ycHVzXCIsXG4gIG5hbWU6IFwiQ29ycHVzIFJBRyAmIEtHIFNlYXJjaFwiLFxuICBkZXNjcmlwdGlvbjogXCLor63mlpnlupPmkJzntKLkuI7nn6Xor4blm77osLHmn6Xor6Llt6XlhbdcIixcbiAgcmVnaXN0ZXIoYXBpKSB7XG4gICAgY29uc3QgY2ZnID0gbm9ybWFsaXplQ29ycHVzUGx1Z2luQ29uZmlnKGFwaS5wbHVnaW5Db25maWcpO1xuXG4gICAgYXBpLm9uPy4oXCJnYXRld2F5X3N0YXJ0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghaXNDb25maWd1cmVkKGNmZykpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltDb3JwdXMgUGx1Z2luXSDimqDvuI8g5o+S5Lu25pyq6YWN572u44CC6K+36L+Q6KGM77yab3BlbmNsYXcgY29ycHVzIHNldHVwXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBpLm9uPy4oXCJiZWZvcmVfdG9vbF9jYWxsXCIsIGFzeW5jICh7IHRvb2wgfTogeyB0b29sOiB7IG5hbWU6IHN0cmluZyB9IH0pID0+IHtcbiAgICAgIGlmICh0b29sLm5hbWUgPT09IFwiZ2VuZXJhbC1yYWctc2VhcmNoXCIgfHwgdG9vbC5uYW1lID09PSBcImdlbmVyYWwta2ctc2VhcmNoXCIpIHtcbiAgICAgICAgY29uc3QgY3VycmVudENmZyA9IG5vcm1hbGl6ZUNvcnB1c1BsdWdpbkNvbmZpZyhhcGkucGx1Z2luQ29uZmlnKTtcbiAgICAgICAgaWYgKCFpc0NvbmZpZ3VyZWQoY3VycmVudENmZykpIHtcbiAgICAgICAgICBjb25zdCBtaXNzaW5nQ29uZmlncyA9IGdldE1pc3NpbmdDb25maWdzKGN1cnJlbnRDZmcpO1xuICAgICAgICAgIGNvbnN0IG1pc3NpbmdMaXN0ID0gbWlzc2luZ0NvbmZpZ3MubWFwKGsgPT4gYFxcYCR7a31cXGBgKS5qb2luKFwiLCBcIik7XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJsb2NrOiB0cnVlLFxuICAgICAgICAgICAgYmxvY2tSZWFzb246IGBDb3JwdXMg5o+S5Lu257y65bCR5b+F6KaB6YWN572u77yaJHttaXNzaW5nTGlzdH3jgIJcXG5cXG7or7fpgInmi6nku6XkuIvku7vkuIDmlrnlvI/lrozmiJDphY3nva7vvJpcXG5cXG4xLiDov5DooYzkuqTkupLlvI/phY3nva7lkb3ku6TvvJpcXG4gICBvcGVuY2xhdyBjb3JwdXMgc2V0dXBcXG5cXG4yLiDmiJbnm7TmjqXorr7nva7nvLrlpLHnmoTphY3nva7pobnvvJpcXG4gICBvcGVuY2xhdyBjb25maWcgc2V0IHBsdWdpbnMuZW50cmllcy5jb3JwdXMuY29uZmlnLiR7bWlzc2luZ0NvbmZpZ3NbMF19IFwiWU9VUl9WQUxVRVwiXFxuXFxu56S65L6L77yaXFxuICAgb3BlbmNsYXcgY29uZmlnIHNldCBwbHVnaW5zLmVudHJpZXMuY29ycHVzLmNvbmZpZy5iYXNlVXJsIFwiaHR0cDovLzguMTUzLjc2LjU5OjgwODJcIlxcbiAgIG9wZW5jbGF3IGNvbmZpZyBzZXQgcGx1Z2lucy5lbnRyaWVzLmNvcnB1cy5jb25maWcuYXBpS2V5IFwiWU9VUl9BUElfS0VZXCJcXG4gICBvcGVuY2xhdyBjb25maWcgc2V0IHBsdWdpbnMuZW50cmllcy5jb3JwdXMuY29uZmlnLmRhdGFBdXRoS2V5IFwiWU9VUl9EQVRBX0FVVEhfS0VZXCJgLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGJsb2NrOiBmYWxzZSB9O1xuICAgIH0pO1xuXG4gICAgYXBpLnJlZ2lzdGVyVG9vbD8uKGJ1aWxkUmFnU2VhcmNoVG9vbChjZmcsIHJlc29sdmVHZW5lcmFsUmFnUHJlc2V0KSk7XG4gICAgYXBpLnJlZ2lzdGVyVG9vbD8uKGJ1aWxkS2dTZWFyY2hUb29sKGNmZywgcmVzb2x2ZUdlbmVyYWxLZ1ByZXNldCkpO1xuXG4gICAgYXBpLnJlZ2lzdGVyQ2xpPy4oXG4gICAgICAoeyBwcm9ncmFtIH0pID0+IHtcbiAgICAgICAgY29uc3QgY29ycHVzID0gcHJvZ3JhbVxuICAgICAgICAgIC5jb21tYW5kKFwiY29ycHVzXCIpXG4gICAgICAgICAgLmRlc2NyaXB0aW9uKFwiQ29ycHVzIHBsdWdpbiBjb21tYW5kc1wiKTtcblxuICAgICAgICBjb3JwdXNcbiAgICAgICAgICAuY29tbWFuZChcInNldHVwXCIpXG4gICAgICAgICAgLmRlc2NyaXB0aW9uKFwiSW50ZXJhY3RpdmUgY29uZmlndXJhdGlvbiB3aXphcmQgZm9yIGNvcnB1cyBwbHVnaW5cIilcbiAgICAgICAgICAuYWN0aW9uKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHJ1bkludGVyYWN0aXZlU2V0dXAoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGRlc2NyaXB0b3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJjb3JwdXNcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvcnB1cyBwbHVnaW4gY29tbWFuZHNcIixcbiAgICAgICAgICAgIGhhc1N1YmNvbW1hbmRzOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICk7XG4gIH0sXG59KTtcbiJdfQ==
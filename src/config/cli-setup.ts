import { createInterface } from "node:readline";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface PluginConfig {
  baseUrl: string;
  apiKey: string;
  dataAuthKey: string;
  generalRagCorpusIdList: string;
  generalKgSearchDomain: string;
}

function askQuestion(rl: any, question: string, defaultValue?: string): Promise<string> {
  const prompt = defaultValue
    ? `${question} (default: ${defaultValue}): `
    : `${question}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer: string) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

function getOpenClawConfigPath(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || "~";
  return join(homeDir, ".openclaw", "openclaw.json");
}

export async function runInteractiveSetup(): Promise<PluginConfig> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n=== Corpus Plugin 配置向导 ===\n");
  console.log("此向导将引导您完成插件的基本配置。\n");

  const baseUrl = await askQuestion(rl, "请输入 API 服务基础地址 (baseUrl)");
  const apiKey = await askQuestion(rl, "请输入 API Key (apiKey)");
  const dataAuthKey = await askQuestion(rl, "请输入数据鉴权密钥 (dataAuthKey)");
  const generalRagCorpusIdList = await askQuestion(
    rl,
    "请输入 RAG 语料库 ID 列表，逗号分隔 (generalRagCorpusIdList)"
  );
  const generalKgSearchDomain = await askQuestion(
    rl,
    "请输入知识图谱检索领域 (generalKgSearchDomain)"
  );

  rl.close();

  const config: PluginConfig = {
    baseUrl,
    apiKey,
    dataAuthKey,
    generalRagCorpusIdList,
    generalKgSearchDomain,
  };

  console.log("\n=== 配置完成 ===\n");
  console.log("正在保存配置到 ~/.openclaw/openclaw.json...\n");

  const configPath = getOpenClawConfigPath();
  let openClawConfig: any = { plugins: { entries: {} } };

  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, "utf8");
      openClawConfig = JSON.parse(content);
    } catch (error) {
      console.log("⚠️  读取现有配置文件失败，将创建新文件");
    }
  }

  if (!openClawConfig.plugins) openClawConfig.plugins = {};
  if (!openClawConfig.plugins.entries) openClawConfig.plugins.entries = {};
  
  // 保存配置到 plugins.entries.corpus.config
  openClawConfig.plugins.entries.corpus = {
    enabled: true,
    config,
  };

  writeFileSync(configPath, JSON.stringify(openClawConfig, null, 2), "utf8");

  console.log(`✅ 配置已保存到：${configPath}\n`);
  console.log("配置摘要：");
  console.log(`  baseUrl: ${config.baseUrl}`);
  console.log(`  apiKey: ${config.apiKey}`);
  console.log(`  dataAuthKey: ${config.dataAuthKey}`);
  console.log(`  generalRagCorpusIdList: ${config.generalRagCorpusIdList}`);
  console.log(`  generalKgSearchDomain: ${config.generalKgSearchDomain}\n`);
  console.log("配置完成！重启 Gateway 后生效。\n");

  return config;
}

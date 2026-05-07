---
name: corpus-rag-search
description: 当用户需要依据公司内部已入库资料、文档分片作答时，选用 general-rag-search；调用时只传 userQuery。语料 ID 与连接项在 ~/.openclaw/openclaw.json 的 plugins.entries.corpus.config 中配置（见插件 openclaw.plugin.json#configSchema）。
metadata: { "openclaw": { "emoji": "📚" } }
---

# 公司内部资料 RAG（`general-rag-search`）

## 使用范围（何时选用本能力）

当用户需要查找公司内的专属资料以辅助回答时，使用本工具。

## 前置条件

确认 **`plugins.entries.corpus.config`** 已配置 **`baseUrl`**、**`apiKey`**、**`dataAuthKey`**、**`generalRagCorpusIdList`**（及 KG 共用项 **`generalKgSearchDomain`**，因同一插件配置块）。可使用 **`openclaw configure`** 或编辑 **`~/.openclaw/openclaw.json`**。

## 调用方式

只向工具传入 **`userQuery`**（用户问题或检索用语）

## 返回

成功时关注 JSON 中的 **`data.chunk`** 等；失败时看 **`errorMessage`**。

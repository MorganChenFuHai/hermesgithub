---
name: corpus-kg-search
description: 当用户要查公司内部知识图谱资料、实体关系或图谱侧信息时，使用 general-kg-search；调用时只传 userQuery。连接与 generalKgSearchDomain 在 ~/.openclaw/openclaw.json 的 plugins.entries.corpus.config 中配置。
metadata: { "openclaw": { "emoji": "🕸️" } }
---

# 知识图谱检索（`general-kg-search`）

## 使用范围

当用户需要查找公司内部领域的专业领域的图谱资料以辅助回答时，使用本工具。

## 前置条件

确认 **`plugins.entries.corpus.config`** 已配置 **`baseUrl`**、**`apiKey`**、**`dataAuthKey`**、**`generalKgSearchDomain`**（及 RAG 共用项 **`generalRagCorpusIdList`**，因同一插件配置块）。

## 调用方式

只向工具传入 **`userQuery`**（用户问题或检索用语）。**`domain`** 由配置 **`generalKgSearchDomain`** 决定，**不要在 skill 或工具调用里传 domain**。

## 返回

成功时看 JSON 里 **summary / triplets / chunk** 等；失败看 **`errorMessage`**。

# Corpus Plugin 部署文档

语料库搜索与知识图谱查询工具插件

## 目录

- [安装](#安装)
- [配置](#配置)
- [更新](#更新)
- [卸载](#卸载)
- [使用](#使用)

---

## 安装

### 方式一：从本地路径安装（开发环境）

```bash
openclaw plugins install /Users/chenfuhai/work/DaoCloud/code/hermesopenclaw/builtin-plugin/corpus
```

### 方式二：从 npm 安装（生产环境）

```bash
openclaw plugins install @hermes/openclaw-corpus-plugin
```

### 验证安装

```bash
openclaw plugins list | grep corpus
```

安装成功后会显示：
```
corpus | Corpus RAG & KG Search | enabled
```

---

## 配置

### 方式一：交互式配置（推荐）

运行配置向导，按提示输入配置：

```bash
openclaw corpus setup
```

向导会依次询问：
1. API 服务基础地址 (baseUrl)
2. API Key (apiKey)
3. 数据鉴权密钥 (dataAuthKey)
4. RAG 语料库 ID 列表 (generalRagCorpusIdList)
5. 知识图谱检索领域 (generalKgSearchDomain)

### 方式二：命令行配置

使用 JSON 格式一次性设置所有配置：

```bash
openclaw config set plugins.entries.corpus.config '{"baseUrl": "http://8.153.76.59:8082", "apiKey": "HelloWorld", "dataAuthKey": "A5B52A22DB2D47659173B0AFEEDDD03A", "generalRagCorpusIdList": "2031244380576124929,2030911321436098575,2031244180788842497", "generalKgSearchDomain": "test"}'
```

### 方式三：逐项配置

单独设置每个配置项：

```bash
# 设置 API 服务基础地址
openclaw config set plugins.entries.corpus.config.baseUrl "http://8.153.76.59:8082"

# 设置 API Key
openclaw config set plugins.entries.corpus.config.apiKey "HelloWorld"

# 设置数据鉴权密钥
openclaw config set plugins.entries.corpus.config.dataAuthKey "A5B52A22DB2D47659173B0AFEEDDD03A"

# 设置 RAG 语料库 ID 列表（逗号分隔）
openclaw config set plugins.entries.corpus.config.generalRagCorpusIdList "2031244380576124929,2030911321436098575,2031244180788842497"

# 设置知识图谱检索领域
openclaw config set plugins.entries.corpus.config.generalKgSearchDomain "test"
```

### 配置文件位置

配置保存在：`~/.openclaw/openclaw.json`

配置结构示例：

```json
{
  "plugins": {
    "entries": {
      "corpus": {
        "enabled": true,
        "config": {
          "baseUrl": "http://8.153.76.59:8082",
          "apiKey": "HelloWorld",
          "dataAuthKey": "A5B52A22DB2D47659173B0AFEEDDD03A",
          "generalRagCorpusIdList": "2031244380576124929,2030911321436098575,2031244180788842497",
          "generalKgSearchDomain": "test"
        }
      }
    }
  }
}
```

### 配置说明

| 配置项 | 说明 | 是否必填 | 示例 |
|--------|------|----------|------|
| `baseUrl` | 语料/图谱 API 服务基础地址（无尾斜杠） | 是 | `http://8.153.76.59:8082` |
| `apiKey` | API Key，请求头名固定为 `X-API-Key` | 是 | `HelloWorld` |
| `dataAuthKey` | 数据鉴权密钥，请求头名固定为 `dataAuthkey` | 是 | `A5B52A22DB2D47659173B0AFEEDDD03A` |
| `generalRagCorpusIdList` | RAG 语料库 ID 列表，逗号分隔 | 是 | `2031244380576124929,2030911321436098575` |
| `generalKgSearchDomain` | 知识图谱检索领域（单值） | 是 | `test` |

### 使配置生效

配置完成后，需要重启 Gateway：

```bash
openclaw gateway restart
```

---

## 更新

### 检查更新

```bash
openclaw plugins list
```

### 更新插件

```bash
# 从本地路径更新
openclaw plugins update corpus

# 或从 npm 更新到最新版本
openclaw plugins update @hermes/openclaw-corpus-plugin
```

### 更新后操作

更新后建议重启 Gateway：

```bash
openclaw gateway restart
```

---

## 卸载

### 禁用插件

```bash
openclaw plugins disable corpus
```

### 完全卸载

```bash
openclaw plugins uninstall corpus
```

### 清理配置（可选）

如需完全清理配置，编辑 `~/.openclaw/openclaw.json`，删除 `plugins.entries.corpus` 部分。

---

## 使用

### 可用工具

安装并配置完成后，插件提供以下工具：

1. **general-rag-search** - RAG 语料库搜索
2. **general-kg-search** - 知识图谱搜索

### 工具调用示例

在对话中直接使用：

```
搜索关于人工智能的文档
```

或明确指定工具：

```
使用 general-rag-search 搜索关键词 "机器学习"
使用 general-kg-search 查询领域 "test" 的知识
```

### 配置检查

如果配置不完整，调用工具时会收到错误提示：

```
Corpus 插件缺少必要配置：`baseUrl`, `apiKey`。

请选择以下任一方式完成配置：

1. 运行交互式配置命令：
   openclaw corpus setup

2. 或直接设置缺失的配置项：
   openclaw config set plugins.entries.corpus.config.baseUrl "YOUR_VALUE"
```

---

## 故障排查

### 查看插件状态

```bash
openclaw plugins list | grep corpus
```

### 查看 Gateway 日志

```bash
openclaw gateway logs
```

### 重新安装

如果遇到问题，尝试重新安装：

```bash
openclaw plugins uninstall corpus
openclaw plugins install /Users/chenfuhai/work/DaoCloud/code/hermesopenclaw/builtin-plugin/corpus
```

### 配置验证

检查配置文件是否有效：

```bash
openclaw doctor
```

---

## 技术支持

- 项目地址：`/Users/chenfuhai/work/DaoCloud/code/hermesopenclaw/builtin-plugin/corpus`
- OpenClaw 文档：https://docs.openclaw.ai

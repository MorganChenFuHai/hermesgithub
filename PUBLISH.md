# Corpus 插件发布指南

## 发布插件

### 完整发布命令

```bash
clawhub package publish /Users/chenfuhai/work/DaoCloud/code/hermesopenclaw/builtin-plugin/corpus --family code-plugin --source-repo https://github.com/hermesopenclaw/hermesopenclaw --source-commit $(git -C /Users/chenfuhai/work/DaoCloud/code/hermesopenclaw rev-parse HEAD) --version 1.0.0
```

### 命令参数详解

#### `clawhub package publish`
ClawHub CLI 的插件发布命令，用于将 OpenClaw 插件发布到 ClawHub  registry。

#### `/Users/chenfuhai/work/DaoCloud/code/hermesopenclaw/builtin-plugin/corpus`
**插件目录路径** - 指定要发布的插件源代码所在的文件夹路径。

- **为什么需要**：ClawHub 需要读取插件目录中的 `package.json`、`openclaw.plugin.json` 以及编译后的 `dist/` 目录等文件
- **路径格式**：可以使用绝对路径或相对路径
- **目录要求**：
  - 必须包含 `package.json` 文件
  - 必须包含 `openclaw.plugin.json` 文件（插件配置）
  - 建议包含编译后的 `dist/` 目录

#### `--family code-plugin`
**插件家族类型** - 指定插件的类型分类。

- **为什么需要**：ClawHub 支持多种插件类型，需要明确标识
- **可选值**：
  - `code-plugin`：代码插件（扩展 OpenClaw 功能）
  - `bundle-plugin`：捆绑插件
- **为什么选 `code-plugin`**：Corpus 插件是一个标准的 OpenClaw 代码插件，提供了 RAG 搜索和 KG 搜索工具

#### `--source-repo https://github.com/hermesopenclaw/hermesopenclaw`
**源代码仓库地址** - 指定插件源代码托管的 GitHub 仓库。

- **为什么需要**：
  - 提供插件源代码的可追溯性
  - 方便用户查看源码、提交 issue
  - 符合开源插件的透明度要求
- **格式要求**：
  - 完整的 GitHub URL：`https://github.com/owner/repo`
  - 或简写格式：`owner/repo`
- **注意事项**：仓库应该是公开的，以便其他用户访问

#### `--source-commit $(git -C /Users/chenfuhai/work/DaoCloud/code/hermesopenclaw rev-parse HEAD)`
**源代码提交哈希** - 指定发布版本对应的 Git commit SHA。

- **为什么需要**：
  - 精确关联发布版本与源代码状态
  - 确保可复现性和版本追溯
  - 方便安全扫描和审计
- **命令解析**：
  - `git -C /Users/chenfuhai/work/DaoCloud/code/hermesopenclaw rev-parse HEAD`：获取指定仓库的当前提交哈希
  - `-C <path>`：切换到指定目录执行 git 命令
  - `rev-parse HEAD`：返回当前 HEAD 指向的 commit SHA
- **替代写法**：
  - 手动指定：`--source-commit abc123def456...`
  - 使用标签：`--source-ref v1.0.0`

#### `--version 1.0.0`
**发布版本号** - 指定插件的发布版本。

- **为什么需要**：
  - 遵循语义化版本规范（Semantic Versioning）
  - 管理插件的更新和兼容性
  - 用户安装时可以指定版本
- **格式规范**：`主版本。次版本.修订版本`（MAJOR.MINOR.PATCH）
  - `1.0.0`：初始稳定版本
  - `1.0.1`：Bug 修复
  - `1.1.0`：新增功能（向后兼容）
  - `2.0.0`：重大变更（可能不兼容）

### 可选参数

#### `--dry-run`
**预演模式** - 模拟发布过程但不实际上传。

```bash
# 示例：发布前验证配置
clawhub package publish ./corpus --family code-plugin --source-repo https://github.com/hermesopenclaw/hermesopenclaw --source-commit $(git rev-parse HEAD) --version 1.0.0 --dry-run
```

- **用途**：检查插件配置是否正确，文件是否完整
- **建议**：正式发布前先用 `--dry-run` 验证

#### `--display-name "自定义名称"`
**显示名称** - 覆盖 package.json 中的显示名称。

#### `--changelog "更新说明"`
**更新日志** - 添加版本更新说明。

#### `--tags <tags>`
**标签** - 为发布版本添加标签（默认：`latest`）。

```bash
# 示例：添加多个标签
clawhub package publish ./corpus --family code-plugin ... --tags "latest,stable,v1"
```

### 简化命令（在插件目录下执行）

如果当前已经在插件目录中，可以简化为：

```bash
cd /Users/chenfuhai/work/DaoCloud/code/hermesopenclaw/builtin-plugin/corpus

# 方式 1：使用相对路径
clawhub package publish . --family code-plugin --source-repo https://github.com/hermesopenclaw/hermesopenclaw --source-commit $(git rev-parse HEAD) --version 1.0.0

# 方式 2：使用 GitHub 路径（自动检测 source-path）
clawhub package publish . --family code-plugin --source-repo hermesopenclaw/hermesopenclaw --source-commit $(git rev-parse HEAD) --version 1.0.0
```

---

## 安装插件

### 从 ClawHub 安装（推荐）

```bash
openclaw plugins install @hermes/openclaw-corpus-plugin
```

或

```bash
clawhub install @hermes/openclaw-corpus-plugin
```

### 安装指定版本

```bash
openclaw plugins install @hermes/openclaw-corpus-plugin@1.0.0
```

## 发布前检查清单

在发布插件之前，请确保：

- [ ] 已移除所有环境访问敏感代码（如 `process.env`）
- [ ] `package.json` 配置正确
- [ ] `openclaw.plugin.json` 配置正确
- [ ] 代码已编译到 `dist/` 目录
- [ ] 运行过 `--dry-run` 验证
- [ ] GitHub 仓库已设置为公开
- [ ] 已登录 ClawHub（`clawhub whoami`）
- [ ] 版本号遵循语义化规范

---

## 常见问题

### Q1: 发布时提示 "package.json required"

**原因**：ClawHub 在指定目录找不到 `package.json`

**解决方案**：
- 确认路径正确
- 使用绝对路径
- 检查 `package.json` 是否存在

### Q2: 发布时提示 "Not logged in"

**原因**：未登录 ClawHub

**解决方案**：
```bash
clawhub login
```

### Q3: 发布时提示权限错误 "EPERM: operation not permitted"

**原因**：CLI 无法写入配置文件

**解决方案**：
```bash
# 手动创建配置目录
mkdir -p "~/Library/Application Support/clawhub"
chmod 755 "~/Library/Application Support/clawhub"

# 然后重新登录
clawhub login
```

### Q4: 如何更新已发布的插件？

**解决方案**：
```bash
# 增加版本号后重新发布
clawhub package publish ./corpus --family code-plugin ... --version 1.0.1
```

---

## 参考资源

- [ClawHub 官网](https://clawhub.ai/)
- [OpenClaw 插件开发文档](https://docs.openclaw.ai/plugins/building-plugins)
- [语义化版本规范](https://semver.org/)

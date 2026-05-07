# Corpus 插件发布指南

从 GitHub 发布插件到 ClawHub Registry

## 前置条件

### 方式：使用 npm

1. **安装 ClawHub CLI**
   ```bash
   npm install -g clawhub
   
   ```
   > 注意：此方式需要 Bun 运行环境支持

2. **登录 ClawHub**
   ```bash
   clawhub login
   ```

### 构建插件

```bash
npm run build
```

## 发布步骤

### 1. 预演发布（推荐）

正式发布前，先验证配置：

```bash
clawhub package publish MorganChenFuHai/hermesgithub --dry-run
```

### 2. 正式发布

```bash
clawhub package publish MorganChenFuHai/hermesgithub
```

### 3. 指定版本发布

```bash
clawhub package publish MorganChenFuHai/hermesgithub@1.0.0
```

### 4. 使用完整 URL 发布

```bash
clawhub package publish https://github.com/MorganChenFuHai/hermesgithub
```

## 命令参数说明

### 基本命令格式

```bash
clawhub package publish <github-repo> [options]
```

### 常用参数

| 参数 | 说明 | 示例 |
|------|------|------|
| 无参数 | 发布最新版本 | `clawhub package publish MorganChenFuHai/hermesgithub` |
| `@version` | 发布指定版本 | `clawhub package publish MorganChenFuHai/hermesgithub@1.0.0` |
| `--dry-run` | 预演模式（不实际发布） | `clawhub package publish MorganChenFuHai/hermesgithub --dry-run` |
| `--tags` | 添加版本标签 | `clawhub package publish MorganChenFuHai/hermesgithub --tags "latest,stable"` |

## 版本管理

### 语义化版本规范

遵循 `MAJOR.MINOR.PATCH` 格式：

- **MAJOR**（主版本号）：重大变更，可能不兼容
- **MINOR**（次版本号）：新增功能，向后兼容
- **PATCH**（修订号）：Bug 修复，向后兼容

### 更新版本流程

1. **更新 package.json 中的版本号**
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **提交并推送**
   ```bash
   git add .
   git commit -m "chore: bump version to 1.0.1"
   git push origin main
   ```

3. **创建 Git 标签**
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

4. **发布到 ClawHub**
   ```bash
   clawhub package publish MorganChenFuHai/hermesgithub@1.0.1
   ```

## 验证发布

### 查看已发布的版本

```bash
clawhub package list MorganChenFuHai/hermesgithub
```

### 安装已发布的插件

```bash
openclaw plugins install MorganChenFuHai/hermesgithub
```

或指定版本：

```bash
openclaw plugins install MorganChenFuHai/hermesgithub@1.0.0
```

## 常见问题

### Q: 发布失败怎么办？

1. 检查是否已登录：`clawhub login`
2. 检查网络连接
3. 使用 `--dry-run` 预演模式排查问题

### Q: 如何更新已发布的插件？

1. 修改代码并更新版本号
2. 提交到 GitHub 并打标签
3. 使用新版本号重新发布

### Q: 如何删除已发布的版本？

```bash
clawhub package unpublish MorganChenFuHai/hermesgithub@1.0.0
```

## 参考链接

- [ClawHub 官方文档](https://clawhub.io/docs)
- [插件开发指南](https://clawhub.io/docs/plugins)
- [语义化版本规范](https://semver.org/)

# just-tools

轻量小工具集合。当前内置 **JSON 编辑 / 格式化**，预留扩展入口以便后续添加更多工具（转换、在线运行代码等）。

## 使用方式

1. 本地开启静态服务器（任选其一）：
   - `python -m http.server 8080` 之后访问 http://localhost:8080
   - 或 `npx serve` / `npx http-server` 在仓库根目录运行。
2. 打开 `index.html` 即可使用。

## 功能简介（JSON 工具）
- JSON 校验与格式化（支持快捷键 Ctrl/Cmd + Enter）。
- 压缩输出、下载、复制、示例填充、清空。
- 在“格式化 / 可编辑”区域修改后，可一键“应用到源 JSON”，实现对原数据的编辑。
- 数据自动保存到浏览器 `localStorage`。

## 结构
- `index.html`：主入口，加载工具注册表。
- `css/styles.css`：界面样式。
- `js/registry.js`：工具注册/导航逻辑。
- `js/tools/jsonEditor.js`：JSON 工具实现。

## 扩展说明
- 新工具以模块形式放在 `js/tools/` 下，导出 `{ id, label, tools: [...] }` 结构，并在 `js/app.js` 中注册即可。
- 界面和逻辑保持无依赖的原生实现，便于低资源环境部署。

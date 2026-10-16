# Tiny Agent
轻量 TypeScript Agent 工具调用框架，pnpm monorepo 架构，支持大模型串行工具调用、事件回调，兼容火山方舟/OpenAI 接口，内置模拟模型用于本地调试。

## ✨ 特性
- Monorepo 分包：核心Agent包、OpenAI模型适配器、Demo演示应用
- 串行工具执行，规避并行调用带来的参数幻觉
- 完整事件回调，方便日志输出与流式展示
- 双模型模式：真实OpenAI兼容API / ScriptedModel本地模拟模型
- TypeScript 全类型，tsdown打包输出 ESM

## 🧩 技术栈
- TypeScript + Node.js >=18
- pnpm workspace（monorepo）
- 构建：tsdown
- 环境变量：dotenv
- LLM：OpenAI兼容接口（火山方舟、OpenAI等）

## 📁 目录结构
```plaintext
tiny-agent/
├── .env                      # 根目录环境变量
├── packages/
│   ├── agent/                # Agent 核心逻辑
│   └── openai-provider/      # OpenAI 兼容模型适配器
└── apps/demo/                # 演示入口
    └── src/
    ├── index.ts              # Demo 启动入口
    └── tools.ts              # 自定义工具定义
```

## 🚀 快速开始
### 1. 安装依赖
```bash
# 项目根目录执行
pnpm install
```
###  2. 配置环境变量
`@tiny-agent/demo`项目根目录 `.env`
```typescript
OPENAI_MODEL=xxx
OPENAI_API_KEY=xxx
OPENAI_BASE_URL=xxx
```
|留空模型变量，自动切换为本地模拟模型，无需 API。
###  3. 打包
```bash
pnpm build
```
###  4. 运行 Demo
```bash
node apps/demo/dist/index.js
```

## 🛠 自定义工具
工具遵循标准 Function Call 结构，实现 `name`、`description`、`parameters`、`parse`、`execute`，传入`runAgent`的 tools 数组即可。

## ⚙️ 核心 API runAgent
```typescript
await runAgent(prompt, {
  model,
  tools: [自定义工具数组],
  systemPrompt: "一次只能调用一个工具，不可并行调用",
  maxTurns: 8,
  onEvent: 事件回调函数
})

```
## 📡 事件回调（onEvent）
- `agent_start`：任务开始
- `turn_start`：新一轮思考
- `assistant`：模型返回消息 / 工具调用
- `tool_start` / `tool_end`：工具执行起止
- `agent_end`：任务完成，返回最终结果

## ⚠️ 关键注意事项
1. 环境变量：monorepo 中使用绝对路径加载 dotenv，打包后路径不会失效
2. systemPrompt 必须限制**单次仅调用一个工具**，减少大模型幻觉
3. 运行命令**必须在项目根目录执行**
4. 未读取到 OPENAI_MODEL，自动降级使用 ScriptedModel
import { AgentEvent, Model } from "@tiny-agent/agent";
import { OpenAIProvider } from "@tiny-agent/openai-provider";
import { ScriptedModel } from "./scripted-model.js";
import { runAgent } from "@tiny-agent/agent";
import { calculateTool, uppercaseTool } from "./tools.js";
import "dotenv/config";
const prompt =
  process.argv.slice(2).join(" ") ||
  "计算 221 × 33，并把 tiny agent 转成大写。然后在计算前面算出来的值乘以 100，再帮我把 heyi zh转成大写，并且跟前面的大写内容合并";

function createModel(): Model {
  const model = process.env.OPENAI_MODEL;
  console.log(model);
  if (!model) return new ScriptedModel();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    throw new Error("OPENAI_API_KEY is required when OPENAI_MODEL is set");
  return new OpenAIProvider({
    model,
    apiKey,
    baseUrl: process.env.OPENAI_BASE_URL,
  });
}
function printEvent(event: AgentEvent): void {
  switch (event.type) {
    case "turn_start":
      console.log(`\n[turn ${event.turn}]`);
      break;
    case "assistant":
      console.log(`assistant: ${event.message.content}`);
      break;
    case "tool_start":
      // tool → 打印工具调用名称+参数
      console.log(
        `tool → ${event.call.name} ${JSON.stringify(event.call.arguments)}`,
      );
      break;
    case "tool_end":
      // tool ← 打印工具返回值
      console.log(`tool ← ${event.call.name}: ${event.result.content}`);
      break;
    case "agent_end":
      console.log("\n最终答案：", event.result);
      break;
  }
}

const result = await runAgent(prompt, {
  model: createModel(),
  tools: [calculateTool, uppercaseTool],
  systemPrompt:
    "你是中文工具调用助手。一次只能调用一个工具，不要并行调用多个工具。严格使用用户给出的数字，不能擅自修改数字。做完一个工具调用，再进行下一步任务。",
  onEvent: printEvent,
});
console.log(result.output);

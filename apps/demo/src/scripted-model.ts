import { AssistantMessage, Model, ModelInput } from "@tiny-agent/agent";

export class ScriptedModel implements Model {
  async generate({ messages }: ModelInput): Promise<AssistantMessage> {
    const toolResults = messages.filter((m) => m.role === "tool");
    if (toolResults.length === 0) {
      //第一轮：返回两个并行工具调用
      return {
        role: "assistant",
        content: "我会并行调用两个工具",
        toolCalls: [
          {
            id: "call_calculate",
            name: "calculate",
            arguments: { a: 21, b: 2, operator: "multiply" },
          },
          {
            id: "call_uppercase",
            name: "uppercase",
            arguments: { text: "tiny agent" },
          },
        ],
      };
    }
    // 第二轮：读取工具结果，返回最终文本
    const values = Object.fromEntries(
      toolResults.map((m) => [m.name, m.content]),
    );
    return {
      role: "assistant",
      content: `计算的结果是${values.calculate},文本结果是${values.uppercase}。`,
      toolCalls: [],
    };
  }
}

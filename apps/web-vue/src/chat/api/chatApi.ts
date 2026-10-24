import type { ChatItem } from '../types'

export async function sendChatRequest(msg: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  // 简单mock逻辑，你可以自由扩展
  const mockReplyList = [
    `收到消息：${msg}，这是Mock返回的回答。`,
    `你说的「${msg}」我已经理解啦，这是模拟AI回复。`,
    `Mock Agent：收到你的输入，测试对话功能正常。`,
  ]
  // 随机返回一条
  const randomIndex = Math.floor(Math.random() * mockReplyList.length)
  return mockReplyList[randomIndex] as string
}

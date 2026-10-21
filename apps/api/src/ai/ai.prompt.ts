import { AiCompletionInput } from '../common/types.js';

export function buildCompletionMessages(input: AiCompletionInput) {
  return [
    {
      role: 'system',
      content: '你是聊天助手。',
    },
    {
      role: 'user',
      content: input.prompt,
    },
  ];
}

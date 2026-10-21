import { z } from 'zod';

export const AiCompletionInputSchema = z.object({
  prompt: z.string(),
});
export type AiCompletionInput = z.infer<typeof AiCompletionInputSchema>;

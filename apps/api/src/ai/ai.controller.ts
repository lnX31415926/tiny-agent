import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AiService } from './ai.service.js';
import { AiCompletionInputSchema } from '../common/types.js';
import { parseDto } from '../common/utils/ai.util.js';

@Controller('ai')
export class AiController {
  constructor(@Inject(AiService) private readonly aiService: AiService) {}

  /**
   * 普通非流式接口：直接返回模型原始文本，无额外包装
   */
  @Post('complete')
  async complete(@Body() body: unknown) {
    const input = parseDto(AiCompletionInputSchema, body);
    const result = await this.aiService.complete(input);
    // 直接返回 text 原始内容，不包裹额外对象（如果你想要返回对象，改成 return result;）
    return result.text;
  }

  /**
   * 流式SSE接口：完全保留原有流式逻辑不变
   */
  @Post('complete/stream')
  async completeStream(@Body() body: unknown, @Res() response: Response) {
    const input = parseDto(AiCompletionInputSchema, body);
    response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    response.setHeader('Cache-Control', 'no-cache, no-transform');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders?.();
    try {
      for await (const text of this.aiService.completeStream(input)) {
        if (response.destroyed || response.writableEnded) {
          return;
        }
        writeSse(response, 'delta', { text });
      }
      writeSse(response, 'done', {});
    } catch (error) {
      writeSse(response, 'error', {
        message: error instanceof Error ? error.message : '流式补全失败',
      });
    } finally {
      response.end();
    }
  }
}

function writeSse(response: Response, event: string, data: unknown) {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(data)}\n\n`);
}

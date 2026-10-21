import { BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

/**
 * 通用dto解析校验工具
 * @param schema zod schema
 * @param body raw @Body() unknown
 */
export function parseDto<T>(schema: ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  console.log(result);
  if (!result.success) {
    throw new BadRequestException({
      message: '请求参数校验失败',
      errors: result.error.issues,
    });
  }
  return result.data;
}
export function messageContentToString() {}

export function cleanInsertionText() {}

import { Module } from '@nestjs/common';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import 'dotenv/config';
@Module({
  controllers: [AiController],
  providers: [
    AiService,
    { provide: 'AI_API_KEY', useValue: process.env.AI_API_KEY },
    { provide: 'AI_BASE_URL', useValue: process.env.AI_BASE_URL },
    { provide: 'AI_CHAT_MODEL', useValue: process.env.AI_CHAT_MODEL },
  ],
  exports: [AiService],
})
export class AiModule {}

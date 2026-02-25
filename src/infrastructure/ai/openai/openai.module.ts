import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AI_SEARCH_PARSER } from '@domain/common/services/ai-search-parser.service';
import { OpenAiSearchParserService } from './openai.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: AI_SEARCH_PARSER,
      useClass: OpenAiSearchParserService,
    },
  ],
  exports: [AI_SEARCH_PARSER],
})
export class OpenAiModule {}

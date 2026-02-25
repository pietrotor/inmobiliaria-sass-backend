import {
  Controller,
  Post,
  Body,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';

import { Auth } from '@interface/http/common';
import { GenerateUploadUrlDto } from '@application/common/dto/generate-upload-url.dto';
import { GenerateUploadUrlUseCase } from '@application/common/use-cases/generate-upload-url.use-case';
import { UploadUrlResponseDto } from '@application/common/dto/upload-url-response.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly generateUploadUrlUseCase: GenerateUploadUrlUseCase,
  ) {}

  @Post('upload-url')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a presigned upload URL' })
  @ApiBody({ type: GenerateUploadUrlDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Presigned upload URL generated successfully',
    type: UploadUrlResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid content type, context, or missing required fields' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  generateUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return this.generateUploadUrlUseCase.execute(dto);
  }
}

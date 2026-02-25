import { ApiProperty } from '@nestjs/swagger';

export class UploadUrlResponseDto {
  @ApiProperty({
    example:
      'https://bucket.s3.region.amazonaws.com/projects/uuid/images/file-id.jpg?X-Amz-Algorithm=...',
  })
  uploadUrl: string;

  @ApiProperty({
    example:
      'https://bucket.s3.region.amazonaws.com/projects/uuid/images/file-id.jpg',
  })
  publicUrl: string;

  @ApiProperty({ example: 'projects/uuid/images/file-id.jpg' })
  key: string;
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { CreatePostSaleRequestUseCase } from '@application/post-sale/use-cases/create-post-sale-request.use-case';
import { UpdatePostSaleStatusUseCase } from '@application/post-sale/use-cases/update-post-sale-status.use-case';
import { GetPostSaleRequestsUseCase } from '@application/post-sale/use-cases/get-post-sale-requests.use-case';
import { CreatePostSaleRequestDto } from '@application/post-sale/dto/create-post-sale-request.dto';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { PostSaleRequestStatus } from '@domain/post-sale/value-objects/request-status.vo';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Post-Sale')
@Controller('post-sale')
export class PostSaleController {
  constructor(
    private readonly createPostSaleRequestUseCase: CreatePostSaleRequestUseCase,
    private readonly updatePostSaleStatusUseCase: UpdatePostSaleStatusUseCase,
    private readonly getPostSaleRequestsUseCase: GetPostSaleRequestsUseCase,
  ) {}

  @Post()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a post-sale request' })
  @ApiResponse({ status: HttpStatus.CREATED })
  create(@Body() dto: CreatePostSaleRequestDto) {
    return this.createPostSaleRequestUseCase.execute(dto);
  }

  @Get('unit/:unitId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get post-sale requests for a unit' })
  @ApiParam({ name: 'unitId', type: String })
  getByUnit(
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.getPostSaleRequestsUseCase.execute(
      unitId,
      pagination.limit,
      pagination.offset,
    );
  }

  @Patch(':requestId/status/:status')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post-sale request status' })
  @ApiParam({ name: 'requestId', type: String })
  @ApiParam({ name: 'status', enum: PostSaleRequestStatus })
  updateStatus(
    @GetUser() user: User,
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Param('status') status: PostSaleRequestStatus,
  ) {
    return this.updatePostSaleStatusUseCase.execute(
      requestId,
      status,
      user.id,
    );
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreatePropertyUseCase } from '@application/property/use-cases/create-property.use-case';
import { GetPropertyUseCase } from '@application/property/use-cases/get-property.use-case';
import { GetPropertiesUseCase } from '@application/property/use-cases/get-properties.use-case';
import { UpdatePropertyUseCase } from '@application/property/use-cases/update-property.use-case';
import { DeletePropertyUseCase } from '@application/property/use-cases/delete-property.use-case';
import {
  AddPropertyImageUseCase,
  AddPropertyImageDto,
} from '@application/property/use-cases/add-property-image.use-case';
import { DeletePropertyImageUseCase } from '@application/property/use-cases/delete-property-image.use-case';
import { UploadPropertyImageUseCase } from '@application/property/use-cases/upload-property-image.use-case';
import { AiSearchPropertiesUseCase } from '@application/property/use-cases/ai-search-properties.use-case';

import { CreatePropertyDto } from '@application/property/dto/create-property.dto';
import { UpdatePropertyDto } from '@application/property/dto/update-property.dto';
import { FilterPropertiesDto } from '@application/property/dto/filter-properties.dto';
import { AiSearchDto } from '@application/property/dto/ai-search.dto';

import { Auth, GetUser } from '@interface/http/common';
import { Role } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly getPropertyUseCase: GetPropertyUseCase,
    private readonly getPropertiesUseCase: GetPropertiesUseCase,
    private readonly updatePropertyUseCase: UpdatePropertyUseCase,
    private readonly deletePropertyUseCase: DeletePropertyUseCase,
    private readonly addPropertyImageUseCase: AddPropertyImageUseCase,
    private readonly deletePropertyImageUseCase: DeletePropertyImageUseCase,
    private readonly uploadPropertyImageUseCase: UploadPropertyImageUseCase,
    private readonly aiSearchPropertiesUseCase: AiSearchPropertiesUseCase,
  ) {}

  // ── AI Search ──────────────────────────────────────────────────────

  @Post('ai-search')
  @ApiOperation({
    summary: 'Search properties with natural language (AI-powered)',
    description:
      'Accepts a natural language query (e.g. "apartamento en Las Mercedes, 2 cuartos, menos de 100mil") and uses OpenAI to parse it into structured filters. Returns matching properties plus the parsed filters for transparency.',
  })
  @ApiBody({ type: AiSearchDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'AI-parsed search results',
    schema: {
      example: {
        originalQuery: 'apartamento en Las Mercedes, 2 cuartos, menos de 100mil dólares',
        parsedFilters: {
          propertyType: 'APARTMENT',
          neighborhoodId: 'uuid',
          bedrooms: 2,
          maxPrice: 100000,
          currency: 'USD',
          transactionType: 'SALE',
        },
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      },
    },
  })
  aiSearch(@Body() aiSearchDto: AiSearchDto) {
    return this.aiSearchPropertiesUseCase.execute(aiSearchDto);
  }

  // ── Properties CRUD ─────────────────────────────────────────────────

  @Post()
  @Auth(Role.ADMIN, Role.USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new property',
    description:
      'Creates a new property listing for the authenticated user\'s organization. Property starts in DRAFT status.',
  })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Property successfully created',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @GetUser() user: User,
  ) {
    return this.createPropertyUseCase.execute(
      createPropertyDto,
      user.organizationId,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'List properties with filters and pagination',
    description:
      'Retrieves a paginated list of properties. Supports filtering by type, transaction, location, price range, etc. Public endpoint (no auth required for published properties).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of properties',
    schema: {
      example: {
        data: [],
        total: 100,
        page: 1,
        limit: 20,
        totalPages: 5,
      },
    },
  })
  findAll(@Query() filters: FilterPropertiesDto) {
    return this.getPropertiesUseCase.execute(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get property by ID',
    description:
      'Retrieves a specific property with all its details and images.',
  })
  @ApiParam({
    name: 'id',
    description: 'Property UUID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Property details with images',
  })
  @ApiNotFoundResponse({ description: 'Property not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getPropertyUseCase.execute(id);
  }

  @Put(':id')
  @Auth(Role.ADMIN, Role.USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a property',
    description:
      'Updates an existing property. Only accessible by users of the same organization.',
  })
  @ApiParam({
    name: 'id',
    description: 'Property UUID',
    type: String,
  })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Property successfully updated',
  })
  @ApiNotFoundResponse({ description: 'Property not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @GetUser() user: User,
  ) {
    return this.updatePropertyUseCase.execute(
      id,
      updatePropertyDto,
      user.organizationId,
    );
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a property (soft delete)',
    description:
      'Soft deletes a property. Only accessible by ADMIN users.',
  })
  @ApiParam({
    name: 'id',
    description: 'Property UUID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Property successfully deleted',
    schema: {
      example: { message: 'Property deleted successfully' },
    },
  })
  @ApiNotFoundResponse({ description: 'Property not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.deletePropertyUseCase.execute(id, user.organizationId);
  }

  // ── Property Images ─────────────────────────────────────────────────

  @Post(':id/images')
  @Auth(Role.ADMIN, Role.USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add an image to a property',
    description:
      'Adds an image URL to a property. The first image is automatically set as primary.',
  })
  @ApiParam({
    name: 'id',
    description: 'Property UUID',
    type: String,
  })
  @ApiBody({
    description: 'Image data',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://s3.amazonaws.com/bucket/property-img.jpg',
        },
        altText: { type: 'string', example: 'Living room view' },
        order: { type: 'number', example: 0 },
        isPrimary: { type: 'boolean', example: false },
      },
      required: ['url'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Image successfully added',
  })
  @ApiNotFoundResponse({ description: 'Property not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  addImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() imageDto: AddPropertyImageDto,
    @GetUser() user: User,
  ) {
    return this.addPropertyImageUseCase.execute(
      id,
      imageDto,
      user.organizationId,
    );
  }

  @Post(':id/images/upload')
  @Auth(Role.ADMIN, Role.USER)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload an image file for a property',
    description:
      'Uploads an image file directly to S3 and creates the property_image record automatically. Max 5MB. Supported formats: jpg, png, webp, gif.',
  })
  @ApiParam({
    name: 'id',
    description: 'Property UUID',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (max 5MB, jpg/png/webp/gif)',
        },
        altText: { type: 'string', description: 'Alternative text for the image' },
        order: { type: 'number', description: 'Display order' },
        isPrimary: { type: 'boolean', description: 'Set as primary image' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Image uploaded and linked to property',
  })
  @ApiNotFoundResponse({ description: 'Property not found' })
  @ApiBadRequestResponse({ description: 'Invalid file type or size' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: { altText?: string; order?: string; isPrimary?: string },
    @GetUser() user: User,
  ) {
    return this.uploadPropertyImageUseCase.execute(id, file, user.organizationId, {
      altText: body.altText,
      order: body.order ? parseInt(body.order, 10) : undefined,
      isPrimary: body.isPrimary === 'true',
    });
  }

  @Delete('images/:imageId')
  @Auth(Role.ADMIN, Role.USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a property image',
    description:
      'Removes an image from a property. If the deleted image was primary, the next image becomes primary.',
  })
  @ApiParam({
    name: 'imageId',
    description: 'Property Image UUID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image successfully deleted',
    schema: {
      example: { message: 'Image deleted successfully' },
    },
  })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  removeImage(
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @GetUser() user: User,
  ) {
    return this.deletePropertyImageUseCase.execute(
      imageId,
      user.organizationId,
    );
  }
}

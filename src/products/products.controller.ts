import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('fields') fields: string,
  ) {
    const take = limit ? +limit : 20;
    const skip = offset ? +offset : 0;
    const res = await this.productsService.findAll(
      typeof take !== 'number' ? 20 : take,
      typeof skip !== 'number' ? 0 : skip,
      fields,
    );
    return { ...res, limit: res.product.length, offset: skip };
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('fields') fields: string) {
    return this.productsService.findOne(+id, fields);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProductDto: UpdateProductDto,
    @Query('fields') fields: string,
  ) {
    return this.productsService.update(
      +id,
      req.user.sub,
      updateProductDto,
      fields,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.productsService.remove(+id, req.user.sub);
  }
}

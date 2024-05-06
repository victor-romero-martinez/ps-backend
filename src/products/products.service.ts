import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateSelect } from 'src/utils/generateSelect';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

const fieldsResponse = [
  'id',
  'code',
  'barcode',
  'product_name',
  'price',
  'desc',
  'thumbnails',
  'updated_at',
  'created_at',
];

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepo.create(createProductDto);
    return await this.productRepo.save(product);
  }

  async findAll(fields?: string) {
    return await this.productRepo.find({
      select: generateSelect(fields, fieldsResponse),
    });
  }

  async findOne(id: number, fields?: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      select: generateSelect(fields, fieldsResponse),
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    fields?: string,
  ) {
    const product = await this.productRepo.update({ id }, updateProductDto);
    if (product.affected === 0) {
      throw new NotFoundException(`Failed updating product #${id}`);
    }
    return await this.findOne(id, fields);
  }

  async remove(id: number) {
    const product = await this.productRepo.delete({ id });
    if (product.affected === 0) {
      throw new NotFoundException(`Failed deleting product #${id}`);
    }
    return { message: `ok` };
  }
}

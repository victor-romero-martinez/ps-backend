import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateSelect } from 'src/utils/generateSelect';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

const placeholder = [
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

  async findAll(take: number, skip: number, fields?: string) {
    const [product, total] = await this.productRepo.findAndCount({
      take,
      skip,
      select: generateSelect({ placeholder, fields }),
    });
    return { product, total };
  }

  async findOne(id: number, fields?: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      select: generateSelect({ placeholder, fields }),
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    sub: number,
    updateProductDto: UpdateProductDto,
    fields?: string,
  ) {
    const product = await this.productRepo.update(
      { id, userId: sub },
      updateProductDto,
    );
    if (product.affected === 0) {
      throw new NotFoundException(
        `You don't have permission to access or not found this resource`,
      );
    }
    return await this.findOne(id, fields);
  }

  async remove(id: number, sub: number) {
    const product = await this.productRepo.delete({ id, userId: sub });
    if (product.affected === 0) {
      throw new NotFoundException(
        `You don't have permission to access or not found this resource`,
      );
    }
    return { message: `ok` };
  }
}

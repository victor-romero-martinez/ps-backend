import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @IsPositive()
  code: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  barcode: number;

  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsUrl()
  @IsNotEmpty()
  thumbnails: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  userId: number;
}

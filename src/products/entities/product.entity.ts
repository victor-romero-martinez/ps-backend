import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ unique: true })
  code: number;

  @Column({ unique: true })
  barcode: number;

  @Column()
  product_name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  desc?: string;

  @Column()
  thumbnails: string;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.products, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: typeof User;
}

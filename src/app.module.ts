import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {
  DATABASE,
  HOST,
  PORT_DB,
  SSL,
  SYNCHRONIZE,
  USER_NAME,
  USER_PASSWORD,
} from './constants';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: HOST,
      port: +PORT_DB,
      username: USER_NAME,
      password: USER_PASSWORD,
      database: DATABASE,
      synchronize: !!SYNCHRONIZE,
      ssl: !!SSL,
      autoLoadEntities: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

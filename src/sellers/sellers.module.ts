import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seller } from "./seller.entity";
import { SellersController } from "./sellers.controller";
import { SellersService } from "./sellers.service";

@Module({
  controllers: [SellersController],
  providers: [SellersService],
  imports: [TypeOrmModule.forFeature([Seller])],
  exports: [TypeOrmModule],
})
export class SellersModule {}

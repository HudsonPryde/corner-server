import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "./customer.entity";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";
import { LoyaltyService } from "../loyalty/loyalty.service";
import { Seller } from "src/sellers/seller.entity";
import { Loyalty } from "src/loyalty/loyalty.entity";

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, LoyaltyService],
  imports: [TypeOrmModule.forFeature([Customer, Seller, Loyalty])],
  exports: [TypeOrmModule],
})
export class CustomersModule {}

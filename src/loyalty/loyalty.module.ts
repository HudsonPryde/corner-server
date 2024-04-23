import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seller } from "../sellers/seller.entity";
import { LoyaltyController } from "./loyalty.controller";
import { LoyaltyService } from "./loyalty.service";
import { Customer } from "src/customers/customer.entity";
import { Loyalty } from "./loyalty.entity";

@Module({
  controllers: [LoyaltyController],
  providers: [LoyaltyService],
  imports: [TypeOrmModule.forFeature([Seller, Customer, Loyalty])],
  exports: [TypeOrmModule],
})
export class LoyaltyModule {}

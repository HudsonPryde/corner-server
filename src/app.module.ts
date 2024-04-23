import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Seller } from "./sellers/seller.entity";
import { SellersModule } from "./sellers/sellers.module";
import { Customer } from "./customers/customer.entity";
import { CustomersModule } from "./customers/customers.module";
import { LoyaltyModule } from "./loyalty/loyalty.module";
import { Loyalty } from "./loyalty/loyalty.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: "postgres://root:KRjZ8dmbIZtfcYZxcYnZxJ5KKL6VxHyd@dpg-co0c5p8l6cac73co2060-a.ohio-postgres.render.com/db_05sq",
      ssl: true,
      type: "postgres",
      port: 5432,
      username: "root",
      password: "KRjZ8dmbIZtfcYZxcYnZxJ5KKL6VxHyd",
      database: "db_05sq",
      entities: [Seller, Customer, Loyalty],
      synchronize: true,
    }),
    SellersModule,
    CustomersModule,
    LoyaltyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

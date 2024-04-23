import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { SellersService } from "./sellers.service";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { Seller } from "./seller.entity";
import { Customer, LoyaltyProgram } from "square";

@Controller("sellers")
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @Get()
  async getSellers(): Promise<Seller[]> {
    return await this.sellersService.getSellers();
  }
  @Post()
  async createSeller(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.createSeller(createSellerDto);
  }
  @Get("/customers/:id")
  async getSellerCustomers(@Param() params: any): Promise<Customer[]> {
    return await this.sellersService.getSellerCustomers(params.id);
  }
  @Get("/program/:id")
  async getSellerLoyaltyProgram(@Param() params: any): Promise<LoyaltyProgram> {
    return await this.sellersService.getSellerLoyaltyProgram(params.id);
  }
  @Get("/locations")
  async getSellerLocations() {
    return await this.sellersService.getSellerLocations();
  }
  @Patch()
  async updateSeller(@Body() seller: Seller) {
    return await this.sellersService.updateSeller(seller);
  }
}

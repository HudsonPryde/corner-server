import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { Customer } from "./customer.entity";

@Controller("customers")
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get(":uid")
  async getCustomer(@Param() params: any): Promise<Customer> {
    return await this.customersService.getCustomer(params.uid);
  }
  @Post()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    console.log(createCustomerDto);
    return this.customersService.createCustomer(createCustomerDto);
  }

  @Get(":uid/loyalty-accounts")
  async getLoyaltyAccounts(@Param() params: any) {
    return await this.customersService.getLoyaltyAccounts(params.uid);
  }
  @Patch()
  async updateCustomer(@Body() customer: Customer) {
    return await this.customersService.updateCustomer(customer);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { LoyaltyService } from "./loyalty.service";
import { EnrollCustomerDto } from "./dto/enroll-customer.dto";
import { AccrueDto } from "./dto/accrue.dto";

@Controller("loyalty")
export class LoyaltyController {
  constructor(private loyaltyService: LoyaltyService) {}
  @Post()
  async enrollCustomer(@Body() loyalty: EnrollCustomerDto) {
    return this.loyaltyService.enrollCustomer(loyalty);
  }
  @Get()
  async getLoyaltyAccounts() {
    return this.loyaltyService.getLoyaltyAccounts();
  }

  @Get(":id/program")
  async getLoyaltyProgram(@Param() params: any) {
    return this.loyaltyService.getLoyaltyProgram(params.id);
  }
  @Post("/accrue")
  async accruePoints(@Body() payment: AccrueDto) {
    return this.loyaltyService.accruePoints(payment);
  }
  @Patch()
  async updateLoyalty(@Body() loyalty: any) {
    return this.loyaltyService.updateLoyalty(loyalty);
  }
}

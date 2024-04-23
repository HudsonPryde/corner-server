import { Injectable } from "@nestjs/common";
import { Customer } from "./customer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoyaltyService } from "../loyalty/loyalty.service";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private loyaltyService: LoyaltyService,
  ) {}

  createCustomer(customer: Omit<Customer, "id" | "loyalty_accounts">) {
    return this.customersRepository.save(customer);
  }

  getCustomer(uid: string) {
    return this.customersRepository.findOne({
      where: { uid },
      relations: { loyalty_accounts: true },
    });
  }

  async getLoyaltyAccounts(uid: string) {
    const customer = await this.customersRepository.findOne({
      where: { uid },
      relations: ["loyalty_accounts"],
    });
    // get the program of each loyalty account
    let programs = [];
    for (const account of customer.loyalty_accounts) {
      const program = await this.loyaltyService.getLoyaltyProgram(account.id);
      programs.push(program);
    }
    return programs;
  }

  async updateCustomer(customer: Customer) {
    return this.customersRepository.save(customer);
  }
}

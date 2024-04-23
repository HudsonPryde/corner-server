import { Injectable } from "@nestjs/common";
import { Seller } from "../sellers/seller.entity";
import { Customer } from "../customers/customer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EnrollCustomerDto } from "./dto/enroll-customer.dto";
import axios from "axios";
import { randomUUID } from "crypto";
import { Loyalty } from "./loyalty.entity";
import {
  ApiResponse,
  Client,
  CreateCardResponse,
  CreateCustomerResponse,
  CreateLoyaltyAccountResponse,
  Environment,
  Location,
  LoyaltyAccount,
  LoyaltyProgram,
  RetrieveLoyaltyProgramResponse,
} from "square";
import { AccrueDto } from "./dto/accrue.dto";

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(Seller) private SellersRepository: Repository<Seller>,
    @InjectRepository(Customer)
    private CustomersRepository: Repository<Customer>,
    @InjectRepository(Loyalty) private LoyaltyRepository: Repository<Loyalty>,
  ) {}

  async enrollCustomer(req: EnrollCustomerDto) {
    try {
      // get the seller's auth token to perform the request
      const seller = await this.SellersRepository.findOneBy({
        id: req.seller_id,
      });
      const user = await this.CustomersRepository.findOneBy({
        id: req.user_id,
      });
      // create the square client to perform actions on the seller's behalf
      const Square = new Client({
        bearerAuthCredentials: {
          accessToken: seller.token,
        },
        environment: Environment.Sandbox,
      });
      // create a new customer in the Square API for this seller
      const {
        result: { customer },
      } = await Square.customersApi.createCustomer({
        phoneNumber: user.phone_number,
        referenceId: user.id.toString(),
      });
      if (!customer) throw new Error("Error creating customer");
      // get the loyalty program for this seller
      const {
        result: { program },
      } = await Square.loyaltyApi.retrieveLoyaltyProgram("main");
      if (!program) throw new Error("No loyalty program found");
      // create a loyalty account for the new customer
      const {
        result: { loyaltyAccount },
      } = await Square.loyaltyApi.createLoyaltyAccount({
        loyaltyAccount: {
          programId: program.id,
          customerId: customer.id,
          mapping: {
            phoneNumber: user.phone_number,
          },
        },
        idempotencyKey: randomUUID(),
      });
      if (!loyaltyAccount) throw new Error("Error creating loyalty account");
      // use payment token to store card on file
      const {
        result: { card },
      } = await Square.cardsApi.createCard({
        sourceId: req.payment_token,
        idempotencyKey: randomUUID(),
        card: {
          customerId: customer.id,
          referenceId: user.id.toString(),
        },
      });
      if (!card) throw new Error("Error creating card");
      // save the loyalty account to the database
      const loyalty = {
        id: loyaltyAccount.id,
        seller_id: seller.id,
        program_id: program.id,
        card_fingerprint: card.fingerprint,
        customer: user,
      };
      user.loyalty_accounts.push(loyalty);
      await this.CustomersRepository.save(user);
      return loyaltyAccount;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  getLoyaltyAccounts() {
    return this.LoyaltyRepository.find();
  }

  async accruePoints(req: AccrueDto) {
    try {
      const { payment } = req.data.object;
      // get the loyalty account for this payment
      const loyalty = await this.LoyaltyRepository.findOneBy({
        card_fingerprint: payment.card_details.card.fingerprint,
      });
      if (!loyalty) throw new Error("No loyalty account found");
      // get the seller's auth token to perform the request
      const seller = await this.SellersRepository.findOneBy({
        merchant_id: req.merchant_id,
      });
      // create the square client to perform actions on the seller's behalf
      const Square = new Client({
        bearerAuthCredentials: {
          accessToken: seller.token,
        },
        environment: Environment.Sandbox,
      });
      // accrue the points to the loyalty account
      const res = await Square.loyaltyApi.accumulateLoyaltyPoints(loyalty.id, {
        accumulatePoints: {
          orderId: payment.order_id,
        },
        idempotencyKey: randomUUID(),
        locationId: payment.location_id,
      });
      return res.result;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async updateLoyalty(account: Loyalty) {
    return this.LoyaltyRepository.save(account);
  }

  async getLoyaltyProgram(id: string) {
    try {
      const loyalty = await this.LoyaltyRepository.findOneBy({
        id,
      });
      const seller = await this.SellersRepository.findOneBy({
        id: loyalty.seller_id,
      });
      const Square = new Client({
        bearerAuthCredentials: {
          accessToken: seller.token,
        },
        environment: Environment.Sandbox,
      });
      // return the program and the location
      const account = await Square.loyaltyApi.retrieveLoyaltyAccount(
        loyalty.id,
      );
      const program = await Square.loyaltyApi.retrieveLoyaltyProgram("main");
      const location = await Square.locationsApi.retrieveLocation(
        program.result.program.locationIds[0],
      );
      const loyaltyProgramInfo = {
        program: program.result.program,
        location: location.result.location,
        account: account.result.loyaltyAccount,
      };
      // replace bigints with strings to avoid JSON parsing issues
      return JSON.stringify(loyaltyProgramInfo, (_, v) =>
        typeof v === "bigint" ? v.toString() : v,
      );
    } catch (e) {
      return e;
    }
  }
}

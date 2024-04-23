import { Injectable } from "@nestjs/common";
import { Seller } from "./seller.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Client,
  Environment,
  ListCustomersResponse,
  LoyaltyProgram,
} from "square";

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller) private sellersRepository: Repository<Seller>,
  ) {}

  createSeller(seller: Omit<Seller, "id">) {
    return this.sellersRepository.save(seller);
  }

  getSellers() {
    return this.sellersRepository.find();
  }

  async getSellerCustomers(id: number) {
    try {
      const seller = await this.sellersRepository.findOne({ where: { id } });
      const square = new Client({
        bearerAuthCredentials: {
          accessToken: seller.token,
        },
        environment: Environment.Sandbox,
      });
      const { customers } =
        (await square.customersApi.listCustomers()) as ListCustomersResponse;
      return customers;
    } catch (e) {
      return e;
    }
  }

  async getSellerLoyaltyProgram(id: number) {
    try {
      const seller = await this.sellersRepository.findOne({ where: { id } });
      const square = new Client({
        bearerAuthCredentials: {
          accessToken: seller.token,
        },
        environment: Environment.Sandbox,
      });
      const res = await square.loyaltyApi.retrieveLoyaltyProgram("main");
      return res.result.program as LoyaltyProgram;
    } catch (e) {
      return e;
    }
  }

  async updateSeller(seller: Seller) {
    return this.sellersRepository.save(seller);
  }

  // return a flat map of all locations
  async getSellerLocations() {
    try {
      // for now since its test data list all locations for every seller
      // this should be updated to filter based on location
      // and use cursor pagination
      const sellers = await this.sellersRepository.find();
      const locations = [];
      for (const seller of sellers) {
        const square = new Client({
          bearerAuthCredentials: {
            accessToken: seller.token,
          },
          environment: Environment.Sandbox,
        });
        const res = await square.locationsApi.listLocations();
        locations.push(...res.result.locations);
      }
      return locations;
    } catch (e) {
      return e;
    }
  }
}

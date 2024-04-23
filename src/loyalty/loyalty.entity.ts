import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Customer } from "../customers/customer.entity";

@Entity()
export class Loyalty {
  @PrimaryColumn()
  id: string;

  @Column()
  program_id: string;

  @Column()
  seller_id: number;

  // should not be storing fingerprints here
  // should be stored in seperate hash table with a reference to the customer
  // the accrue flow: payment -> get card fingerprint and location id -> get customer from hash table
  // -> get loyalty accounts -> get location loyalty program -> if account exists for program accrue points
  @Column()
  card_fingerprint: string;

  @ManyToOne(() => Customer, (customer) => customer.loyalty_accounts)
  customer: Customer;
}

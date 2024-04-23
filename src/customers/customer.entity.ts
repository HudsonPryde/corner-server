import { Loyalty } from "../loyalty/loyalty.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";

/**
 * Represents a customer entity in the database.
 */
@Entity()
export class Customer {
  /**
   * The unique identifier of the customer.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Firebase created uid.
   */
  @Column({ unique: true, nullable: true })
  uid: string;

  /**
   * The given name of the customer.
   */
  @Column()
  given_name: string;

  /**
   * The family name of the customer.
   */
  @Column()
  family_name: string;

  /**
   * The email address of the customer.
   */
  @Column()
  email_address: string;

  /**
   * The phone number of the customer.
   */
  @Column()
  phone_number: string;

  /**
   * The birthday of the customer.
   */
  @Column()
  birthday: string;

  /**
   * The loyalty accounts of the customer.
   */
  @OneToMany(() => Loyalty, (loyalty) => loyalty.customer, { cascade: true })
  @JoinColumn()
  loyalty_accounts: Loyalty[];
}

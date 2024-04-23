import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

/**
 * This should probably be split into `auth` to store the token and `location` to store shop data
 * while keeping this seller entity to represent the merchant object for this seller.
 * the token should be encrypted and decrypted when needed.
 * the location data is needed to get the shops close to the user.
 * if this is split a webhook should be created to update the location and merchant data.
 */

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  merchant_id: string;

  @Column()
  location_id: string;

  @Column()
  token: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  email!: string;
  @Column()
  firstName!: string;
  @Column()
  lastName!: string;
  @Column()
  companyEmail!: string;
  @Column()
  companyName!: string;
}

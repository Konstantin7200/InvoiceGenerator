import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
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

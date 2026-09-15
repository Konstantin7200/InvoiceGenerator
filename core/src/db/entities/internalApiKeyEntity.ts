import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InternalApiKeyEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  key!: string;
}

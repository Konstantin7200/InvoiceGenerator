import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApiKeyEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  key!: string;
}

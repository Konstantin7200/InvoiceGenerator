import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from './clientEntity';
import type { InvoiceStatus } from '../types/invoiceStatus';

@Entity()
export class InvoiceEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  jobs!: Record<string, number>;
  @Column({ type: 'text', default: 'pending' })
  status!: InvoiceStatus;
  @OneToOne(() => ClientEntity)
  @JoinColumn({ name: 'clientEmail', referencedColumnName: 'email' })
  client!: ClientEntity;
}

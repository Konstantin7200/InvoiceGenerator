import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from './clientEntity';
import type { InvoiceStatus } from '../types/invoiceStatus';

@Entity()
export class InvoiceEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'jsonb', default: {} })
  jobs!: Record<string, number>;
  @Column({ type: 'uuid', unique: true, generated: 'uuid' })
  key!: string;
  @Column({ type: 'text', default: 'pending' })
  status!: InvoiceStatus;
  @CreateDateColumn()
  createdAt!: Date;
  @ManyToOne(() => ClientEntity)
  @JoinColumn({ name: 'clientEmail', referencedColumnName: 'email' })
  client!: ClientEntity;
}

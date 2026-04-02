import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Position } from './Position';

@Entity('customers')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  fname!: string;

  @Column({ type: 'varchar', length: 255 })
  lname!: string;

  @Column({ name: 'position_id', unsigned: true })
  positionId!: number;

  @ManyToOne(() => Position)
  @JoinColumn({ name: 'position_id' })
  position!: Position;
}

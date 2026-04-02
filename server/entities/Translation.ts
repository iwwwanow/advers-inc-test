import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';

@Entity('translations')
export class Translation extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  token!: string;

  @Column({ type: 'varchar', length: 255 })
  translation!: string;
}

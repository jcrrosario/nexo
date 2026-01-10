import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('teams')
export class Team extends BaseEntity {
  @Column()
  name: string;
}

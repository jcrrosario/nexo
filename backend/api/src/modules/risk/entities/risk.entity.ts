import { Entity, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../shared/entities/base.entity'
import { Team } from '../../team/team.entity'

@Entity('risks')
export class Risk extends BaseEntity {
  @Column({ type: 'uuid' })
  team_id: string

  @ManyToOne(() => Team)
  team: Team

  @Column({ type: 'int' })
  score: number
}

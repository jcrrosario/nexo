import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Risk } from './entities/risk.entity'

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(Risk)
    private readonly riskRepository: Repository<Risk>
  ) {}

  async getSummary(params: {
    period: number
    teamId?: string
    tenantId: string
  }) {
    const { period, teamId, tenantId } = params

    const query = this.riskRepository
      .createQueryBuilder('r')
      .where('r.tenant_id = :tenantId', { tenantId })
      .andWhere(
        `r.created_at >= NOW() - INTERVAL '${period} months'`
      )

    if (teamId) {
      query.andWhere('r.team_id = :teamId', { teamId })
    }

    return query
      .select('DATE(r.created_at)', 'date')
      .addSelect('AVG(r.score)', 'avg')
      .groupBy('DATE(r.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany()
  }
}

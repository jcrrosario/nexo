import { Controller, Get, Query } from '@nestjs/common'
import { RiskService } from './risk.service'
import { Tenant } from '../../shared/decorators/tenant.decorator'

@Controller('risk')
export class RiskController {
  constructor(
    private readonly riskService: RiskService
  ) {}

  @Get('summary')
  getSummary(
    @Tenant() tenantId: string,
    @Query('period') period = '6',
    @Query('teamId') teamId?: string
  ) {
    return this.riskService.getSummary({
      tenantId,
      period: Number(period),
      teamId,
    })
  }
}

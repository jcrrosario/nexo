import { Controller, Get, Query } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';
import { Tenant } from '../../shared/decorators/tenant.decorator';

@Controller('diagnostic')
export class DiagnosticController {
  constructor(private readonly service: DiagnosticService) {}

  @Get('risk-map')
  getRiskMap(
    @Tenant() tenant: string,
    @Query('months') months = '3',
  ) {
    return this.service.getRiskMap(tenant, Number(months));
  }
}

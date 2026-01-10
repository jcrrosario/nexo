import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Risk } from './entities/risk.entity'
import { RiskService } from './risk.service'
import { RiskController } from './risk.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Risk])],
  controllers: [RiskController],
  providers: [RiskService]
})
export class RiskModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { typeOrmConfig } from './shared/database/typeorm.config'

import { AuthModule } from './modules/auth/auth.module'
import { TeamModule } from './modules/team/team.module'
import { DiagnosticModule } from './modules/diagnostic/diagnostic.module'
import { RiskModule } from './modules/risk/risk.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    TeamModule,
    DiagnosticModule,
    RiskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

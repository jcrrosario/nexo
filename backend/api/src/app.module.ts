import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { typeOrmConfig } from './shared/database/typeorm.config';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    TeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

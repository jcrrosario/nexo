import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Tenant } from '../../shared/decorators/tenant.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(
    @Tenant() tenant: string,
    @Request() req,
    @Body() body: CreateTeamDto,
  ) {
    return this.teamService.create(
      tenant,
      req.user?.email ?? null,
      body,
    );
  }

  @Get()
  findAll(@Tenant() tenant: string) {
    return this.teamService.findAllByTenant(tenant);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ListTeamDto } from './dto/list-team.dto';

import { Tenant } from '../../shared/decorators/tenant.decorator';
import { User } from '../../shared/decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('team')
export class TeamController {
  constructor(private readonly service: TeamService) {}

  @Post()
  create(
    @Body() dto: CreateTeamDto,
    @Tenant() tenantId: string,
    @User() user: any,
  ) {
    return this.service.create(dto, tenantId, user.email);
  }

  @Get()
  findAll(
    @Query() query: ListTeamDto,
    @Tenant() tenantId: string,
  ) {
    return this.service.findAll(query, tenantId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTeamDto,
    @Tenant() tenantId: string,
    @User() user: any,
  ) {
    return this.service.update(id, dto, tenantId, user.email);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Tenant() tenantId: string,
  ) {
    return this.service.remove(id, tenantId);
  }
}

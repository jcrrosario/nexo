import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Team } from './team.entity';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  create(
    tenantId: string,
    userId: string | undefined,
    dto: CreateTeamDto,
  ) {
    const team = this.teamRepository.create({
      name: dto.name,
      tenant_id: tenantId,
      user_id: userId,
    });

    return this.teamRepository.save(team);
  }

  findAllByTenant(tenantId: string) {
    return this.teamRepository.find({
      where: { tenant_id: tenantId },
    });
  }
}

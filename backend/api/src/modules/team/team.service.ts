import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { Team } from './team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ListTeamDto } from './dto/list-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly repo: Repository<Team>,
  ) {}

  async create(dto: CreateTeamDto, tenantId: string, userId: string) {
    const team = this.repo.create({
      name: dto.name,
      tenant_id: tenantId,
      user_id: userId,
    });

    return this.repo.save(team);
  }

  async findAll(dto: ListTeamDto, tenantId: string) {
    const page = Number(dto.page ?? 1);
    const limit = Number(dto.limit ?? 15);
    const skip = (page - 1) * limit;

    const where: any = { tenant_id: tenantId };

    if (dto.search) {
      where.name = ILike(`%${dto.search}%`);
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    dto: UpdateTeamDto,
    tenantId: string,
    userId: string,
  ) {
    await this.repo.update(
      { id, tenant_id: tenantId },
      {
        ...dto,
        user_id: userId,
      },
    );

    return this.repo.findOneBy({ id, tenant_id: tenantId });
  }

  async remove(id: string, tenantId: string) {
    await this.repo.delete({ id, tenant_id: tenantId });
  }
}
